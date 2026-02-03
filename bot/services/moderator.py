import re
import time
import logging
from typing import Tuple, Optional
from aiogram import Bot, types
from bot.database.models import GroupSettings

try:
    import redis
    # Using sync redis for simplicity in simple check or async?
    # Actually async context -> use redis.asyncio
    from redis.asyncio import Redis
    redis_client = Redis(host='localhost', port=6379, db=0, decode_responses=True)
except ImportError:
    redis_client = None
    logging.warning("Redis not installed/found. Flood control disabled.")

class ModerationService:
    
    # Regex Patterns
    LINK_REGEX = re.compile(r'(http://|https://|www\.|t\.me|telegram\.me|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})')
    MENTION_REGEX = re.compile(r'@\w+')
    
    @staticmethod
    def check_message(text: str, settings: GroupSettings, is_forward: bool = False, entities: list = None) -> Tuple[bool, Optional[str]]:
        """
        Analyzes message and return (ShouldDelete, ReasonKey).
        """
        if not text and not is_forward:
            return False, None

        text_lower = text.lower() if text else ""

        # 1. Forward Check
        if settings.delete_forwards and is_forward:
            return True, 'forward_detected'

        # 2. Link Check (Regex + Entities)
        if settings.delete_links:
            # Check entities for text_link or url
            if entities:
                for entity in entities:
                    if entity.type in ['url', 'text_link', 'mention']:
                         if entity.type == 'mention' and not settings.delete_mentions:
                             continue
                         return True, 'link_detected'
            
            # Fallback regex
            if ModerationService.LINK_REGEX.search(text_lower):
                return True, 'link_detected'
            
        # 3. Mention Check
        if settings.delete_mentions and ModerationService.MENTION_REGEX.search(text_lower):
            return True, 'link_detected' 

        # 4. Forbidden Words
        if settings.forbidden_words:
            for bad_word in settings.forbidden_words:
                # Simple containment check
                if bad_word.lower() in text_lower:
                    return True, 'bad_word'

        return False, None

    @staticmethod
    async def is_flood(user_id: int, group_id: int, settings: GroupSettings) -> bool:
        """
        Check if user is flooding using Redis.
        """
        if not settings.anti_spam_enabled or not redis_client:
            return False
            
        key = f"flood:{group_id}:{user_id}"
        
        try:
            # Increment count
            count = await redis_client.incr(key)
            
            # Set expiry on first increment
            if count == 1:
                await redis_client.expire(key, settings.flood_period)
                
            if count > settings.flood_threshold:
                return True
                
        except Exception as e:
            logging.error(f"Redis error: {e}")
            return False
            
        return False

    @staticmethod
    async def punish_user(bot: Bot, group_id: int, user_id: int, action: str, duration_minutes: int = 0) -> bool:
        """
        Execute punishment: kick, ban, mute.
        """
        try:
            if action == 'kick':
                await bot.ban_chat_member(group_id, user_id)
                await bot.unban_chat_member(group_id, user_id) # Kick = Ban + Unban
            elif action == 'ban':
                await bot.ban_chat_member(group_id, user_id)
            elif action == 'mute':
                permissions = types.ChatPermissions(can_send_messages=False)
                until_date = int(time.time()) + (duration_minutes * 60)
                await bot.restrict_chat_member(group_id, user_id, permissions, until_date=until_date)
            return True
        except Exception as e:
            logging.error(f"Failed to punish user {user_id} in {group_id}: {e}")
            return False
