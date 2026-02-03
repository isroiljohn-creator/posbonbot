import re
from bot.database.models import GroupSettings

class ModerationService:
    
    # Basic Regex for common links
    LINK_REGEX = re.compile(r'(http://|https://|www\.|t\.me|telegram\.me)')
    MENTION_REGEX = re.compile(r'@\w+')
    
    @staticmethod
    def check_message(text: str, settings: GroupSettings, is_forward: bool = False) -> tuple[bool, str]:
        """
        Analyzes message and returns (ShouldDelete, ReasonKey).
        """
        if not text and not is_forward:
            return False, None

        text = text.lower() if text else ""

        # 1. Forward Check
        if settings.delete_forwards and is_forward:
            return True, 'forward_detected'

        # 2. Link Check
        if settings.delete_links and ModerationService.LINK_REGEX.search(text):
            return True, 'link_detected'
            
        # 3. Mention Check
        if settings.delete_mentions and ModerationService.MENTION_REGEX.search(text):
            return True, 'link_detected' # Often handled same as links

        # 4. Forbidden Words
        # Note: In production this should use Aho-Corasick for speed if list is large
        if settings.forbidden_words:
            for bad_word in settings.forbidden_words:
                if bad_word.lower() in text:
                    return True, 'bad_word'

        return False, None

    @staticmethod
    def is_spam(user_id: int, redis_client) -> bool:
        """
        Simple rate check. Returns True if spamming.
        Implementation would use Redis INCR + EXPIRE.
        """
        # Placeholder for Redis implementation
        pass
