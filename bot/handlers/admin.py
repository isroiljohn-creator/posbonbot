from aiogram import Router, types
from aiogram.filters import Command
from bot.handlers import admin_router
from bot.locales.i18n import LocalizationService
import time

@admin_router.message(Command("ban"))
async def cmd_ban(message: types.Message):
    # Check if user is admin in the chat
    if message.chat.type not in ['group', 'supergroup']:
        return await message.reply("This command is for groups only.")
        
    member = await message.chat.get_member(message.from_user.id)
    if member.status not in ['administrator', 'creator']:
        return await message.reply(LocalizationService.get('uz', 'error_no_permission')) # Defaulting to UZ for now

    if not message.reply_to_message:
        return await message.reply("Reply to a user to ban.")
        
    user_to_ban = message.reply_to_message.from_user
    
    try:
        await message.chat.ban(user_to_ban.id)
        
        # Determine language
        lang = 'uz' # mocked
        text = LocalizationService.get(lang, 'ban_user', user=user_to_ban.full_name)
        await message.answer(text)
    except Exception as e:
        await message.reply(f"Error: {e}")

@admin_router.message(Command("mute"))
async def cmd_mute(message: types.Message):
    if message.chat.type not in ['group', 'supergroup']:
        return await message.reply("This command is for groups only.")
        
    member = await message.chat.get_member(message.from_user.id)
    if member.status not in ['administrator', 'creator']:
        return await message.reply(LocalizationService.get('uz', 'error_no_permission'))

    if not message.reply_to_message:
        return await message.reply("Reply to a user to mute.")
    
    # Default 60 min if not specified
    duration = 60
    args = message.text.split()
    if len(args) > 1 and args[1].isdigit():
        duration = int(args[1])
        
    user_to_mute = message.reply_to_message.from_user
    
    try:
        until_date = int(time.time()) + (duration * 60)
        # Permissions needed to restrict
        permissions = types.ChatPermissions(can_send_messages=False)
        await message.chat.restrict(user_to_mute.id, permissions, until_date=until_date)
        
        lang = 'uz' 
        text = LocalizationService.get(lang, 'mute_user', user=user_to_mute.full_name, duration=duration)
        await message.answer(text)
    except Exception as e:
        await message.reply(f"Error: {e}")
