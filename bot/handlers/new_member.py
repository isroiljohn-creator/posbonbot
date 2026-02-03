import asyncio
from aiogram import Router, F, types, Bot
from aiogram.filters import ChatMemberUpdatedFilter, KICKED, LEFT, RESTRICTED, MEMBER, ADMINISTRATOR, CREATOR
from aiogram.types import ChatPermissions, InlineKeyboardMarkup, InlineKeyboardButton, ChatMemberUpdated
from sqlalchemy import select
from bot.database.models import GroupSettings
from bot.locales.i18n import LocalizationService

new_member_router = Router()

@new_member_router.message(F.new_chat_members)
async def on_new_members(message: types.Message, session, lang, bot: Bot):
    """
    Handle new members joining the group via Message event (service message).
    """
    # 1. Check if captcha is enabled for this group
    stmt = select(GroupSettings).where(GroupSettings.group_id == message.chat.id)
    result = await session.execute(stmt)
    settings = result.scalar_one_or_none()
    
    if not settings or not settings.captcha_enabled:
        return

    # 2. Restrict & Send Captcha
    permissions = ChatPermissions(
        can_send_messages=False,
        can_send_media_messages=False,
        can_send_polls=False,
        can_send_other_messages=False,
        can_add_web_page_previews=False,
        can_change_info=False,
        can_invite_users=False,
        can_pin_messages=False
    )
    
    for user in message.new_chat_members:
        if user.is_bot:
            continue
            
        try:
            # Mute user
            await message.chat.restrict(user.id, permissions)
            
            # Send Captcha
            text = LocalizationService.get(lang, 'captcha_prompt', user=user.mention_html())
            btn_text = LocalizationService.get(lang, 'captcha_btn')
            
            kb = InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text=btn_text, callback_data=f"captcha_solve:{user.id}")]
            ])
            
            msg = await message.answer(text, reply_markup=kb)
            
            # Schedule auto-kick/unmute via async task (Simplified for prototype)
            # In prod: use Redis keys expiration or Celery
            asyncio.create_task(captcha_timeout(bot, message.chat.id, user.id, msg.message_id, settings.captcha_timeout))
            
        except Exception as e:
            print(f"Error in captcha: {e}")

async def captcha_timeout(bot: Bot, chat_id: int, user_id: int, message_id: int, timeout: int):
    await asyncio.sleep(timeout)
    # Check if user is still restricted (meaning they didn't solve it)
    # This part requires state checking which we'll skip for this prototype and just delete the captcha message
    try:
        await bot.delete_message(chat_id, message_id)
        # Optional: Kick user if strict mode
    except:
        pass

@new_member_router.callback_query(F.data.startswith("captcha_solve:"))
async def on_captcha_solve(callback: types.CallbackQuery, bot: Bot):
    user_id = int(callback.data.split(":")[1])
    
    if callback.from_user.id != user_id:
        await callback.answer("Bu tugma siz uchun emas! / This button is not for you!", show_alert=True)
        return
        
    # Unmute
    default_perms = ChatPermissions(
        can_send_messages=True,
        can_send_media_messages=True,
        can_send_polls=True,
        can_send_other_messages=True,
        can_add_web_page_previews=True,
        can_change_info=False, # Usually defaults
        can_invite_users=True,
        can_pin_messages=False
    )
    
    try:
        await callback.message.chat.restrict(user_id, default_perms)
        await callback.message.delete()
        await callback.answer("Welcome!")
    except Exception as e:
        await callback.answer(f"Error: {e}")
