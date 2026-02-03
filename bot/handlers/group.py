from aiogram import F, Router, types
from aiogram.filters import Command, ChatMemberUpdatedFilter, JOIN_TRANSITION, LEAVE_TRANSITION
from bot.handlers import group_router
from bot.services.moderator import ModerationService
from bot.services.repository import Repository
from bot.locales.i18n import LocalizationService
from aiogram.enums import ChatMemberStatus

@group_router.my_chat_member(ChatMemberUpdatedFilter(member_status_changed=JOIN_TRANSITION))
async def on_bot_join(event: types.ChatMemberUpdated, session):
    repo = Repository(session)
    # Register group and owner
    # The user who added the bot is in event.from_user
    await repo.get_or_create_group(
        group_id=event.chat.id,
        title=event.chat.title,
        owner_id=event.from_user.id
    )
    # Also ensure the user exists
    await repo.upsert_user(
        user_id=event.from_user.id,
        username=event.from_user.username,
        full_name=event.from_user.full_name,
        language=event.from_user.language_code
    )
    
    # Send welcome message
    await event.answer("Bot guruhga qo'shildi! Sozlash uchun /settings buyrug'ini bosing.")

@group_router.message(F.chat.type.in_({'group', 'supergroup'}))
async def handle_group_message(message: types.Message, session):
    repo = Repository(session)
    
    # 1. Ensure User and Group exist in DB
    user = await repo.upsert_user(
        user_id=message.from_user.id,
        username=message.from_user.username,
        full_name=message.from_user.full_name,
        language=message.from_user.language_code
    )
    
    # Ensure group exists (often handled by my_chat_member handler, but good to be safe)
    # We don't have the owner ID easily here if it's a new group we haven't seen.
    # For now, we assume group exists or get_group_settings creates a default one (without owner maybe).
    # Ideally, we listen to 'new_chat_members' (bot added) to set owner.
    
    settings = await repo.get_group_settings(message.chat.id)
    
    # 2. Permission Check (Admins are immune)
    member = await message.chat.get_member(message.from_user.id)
    if member.status in [ChatMemberStatus.CREATOR, ChatMemberStatus.ADMINISTRATOR]:
        return

    # 3. Anti-Spam / Flood
    if await ModerationService.is_flood(message.from_user.id, message.chat.id, settings):
        try:
            await message.delete()
            # Optional: Mute for flood
            await ModerationService.punish_user(message.bot, message.chat.id, message.from_user.id, 'mute', duration_minutes=5)
            await repo.log_action(message.chat.id, message.from_user.id, 'mute', 'flood')
            return
        except Exception:
            pass

    # 4. Content Moderation
    should_delete, reason_key = ModerationService.check_message(
        text=message.text or message.caption,
        settings=settings,
        is_forward=bool(message.forward_origin),
        entities=message.entities or message.caption_entities
    )
    
    if should_delete:
        try:
            await message.delete()
            await repo.log_action(message.chat.id, message.from_user.id, 'delete', reason_key)
            
            # Warn System
            warn_count = await repo.add_warn(message.chat.id, message.from_user.id, reason_key)
            
            # Helper to get text
            reason_text = LocalizationService.get(settings.language, reason_key)
            limit = settings.warn_limit
            
            if warn_count >= limit:
                # Punish
                action = settings.warn_action # mute, kick, ban
                success = await ModerationService.punish_user(
                    message.bot, 
                    message.chat.id, 
                    message.from_user.id, 
                    action, 
                    duration_minutes=settings.mute_duration
                )
                
                if success:
                    # Reset warns
                    await repo.reset_warns(message.chat.id, message.from_user.id)
                    
                    # Notify
                    msg_key = f"{action}_user"
                    text = LocalizationService.get(settings.language, msg_key, user=message.from_user.full_name, duration=settings.mute_duration)
                    await message.answer(text)
            else:
                # Just warn
                text = LocalizationService.get(
                    settings.language, 
                    'warn_user', 
                    user=message.from_user.mention_html(), 
                    reason=reason_text, 
                    count=warn_count, 
                    limit=limit
                )
                await message.answer(text)
                
        except Exception as e:
            print(f"Mod error: {e}")

