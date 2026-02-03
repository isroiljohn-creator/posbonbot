import asyncio
from aiogram import Router, F, types, Bot
from aiogram.types import ChatPermissions, InlineKeyboardMarkup, InlineKeyboardButton
from bot.services.repository import Repository
from bot.locales.i18n import LocalizationService

new_member_router = Router()

@new_member_router.message(F.new_chat_members)
async def on_new_members(message: types.Message, session, lang):
    """
    Handle new members joining the group via Message event.
    """
    repo = Repository(session)
    settings = await repo.get_group_settings(message.chat.id)
    
    if not settings.captcha_enabled:
        return

    # Permissions to restrict
    restrict_perms = ChatPermissions(
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
        if user.is_bot: continue
            
        try:
            # Mute user
            await message.chat.restrict(user.id, restrict_perms)
            
            # Send Captcha
            text = LocalizationService.get(lang, 'captcha_prompt', user=user.mention_html())
            btn_text = LocalizationService.get(lang, 'captcha_btn')
            
            kb = InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text=btn_text, callback_data=f"captcha_solve:{user.id}")]
            ])
            
            msg = await message.answer(text, reply_markup=kb)
            
            # Schedule timeout
            asyncio.create_task(captcha_timeout(message.bot, message.chat.id, user.id, msg.message_id, settings.captcha_timeout))
            
        except Exception as e:
            print(f"Error in captcha: {e}")

async def captcha_timeout(bot: Bot, chat_id: int, user_id: int, message_id: int, timeout: int):
    await asyncio.sleep(timeout)
    try:
        # Check member status
        member = await bot.get_chat_member(chat_id, user_id)
        if member.status == 'restricted' and not member.can_send_messages:
            # Still restricted -> Kick
            await bot.ban_chat_member(chat_id, user_id)
            await bot.unban_chat_member(chat_id, user_id) # Kick (unban allows rejoin)
            await bot.delete_message(chat_id, message_id)
    except Exception as e:
        print(f"Timeout error: {e}")

@new_member_router.callback_query(F.data.startswith("captcha_solve:"))
async def on_captcha_solve(callback: types.CallbackQuery, bot: Bot):
    user_id = int(callback.data.split(":")[1])
    
    if callback.from_user.id != user_id:
        await callback.answer("Bu tugma siz uchun emas! / This button is not for you!", show_alert=True)
        return
        
    # Default Permissions (Restore standard user rights)
    # In strict mode, we might want to check Chat permissions default, but explicit True is safe for now
    default_perms = ChatPermissions(
        can_send_messages=True,
        can_send_media_messages=True,
        can_send_polls=True,
        can_send_other_messages=True,
        can_add_web_page_previews=True,
        can_change_info=False, 
        can_invite_users=True,
        can_pin_messages=False
    )
    
    try:
        await callback.message.chat.restrict(user_id, default_perms)
        await callback.message.delete()
        # await callback.answer("Welcome!") # Optional feedback
    except Exception as e:
        await callback.answer(f"Error: {e}")
