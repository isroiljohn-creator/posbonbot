from aiogram import F, Router
from aiogram.types import Message
from aiogram.filters import Command
from bot.handlers import group_router
from bot.services.moderator import ModerationService
from bot.locales.i18n import LocalizationService
from bot.database.models import GroupSettings, User as DBUser, Group as DBGroup # Mock/Import for types

# Mock fetching settings (In real app, Middleware does this and puts in context)
async def get_mock_settings(chat_id):
    # This would check DB cache
    s = GroupSettings()
    s.language = 'uz'
    s.delete_links = True
    s.delete_forwards = True
    return s

@group_router.message(F.chat.type.in_({'group', 'supergroup'}))
async def handle_group_message(message: Message):
    # 1. Skip if sender is admin (Permissions check)
    # real impl: member = await message.chat.get_member(message.from_user.id)
    # if member.status in ['creator', 'administrator']: return
    
    # 2. Get Settings
    settings = await get_mock_settings(message.chat.id)
    
    # 3. Check Content
    should_delete, reason_key = ModerationService.check_message(
        text=message.text or message.caption,
        settings=settings,
        is_forward=bool(message.forward_origin)
    )
    
    if should_delete:
        try:
            await message.delete()
            # Send warning (optional, maybe ephemeral or throttled)
            warning_text = LocalizationService.get(settings.language, reason_key)
            # await message.answer(warning_text) 
            # Note: best not to spam chat with warnings for every deletion
            
            # Log action to DB here
        except Exception as e:
            print(f"Failed to delete: {e}")

