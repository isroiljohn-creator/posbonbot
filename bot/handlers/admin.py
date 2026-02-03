from aiogram import Router, types
from aiogram.filters import Command
from bot.handlers import admin_router
from bot.locales.i18n import LocalizationService
from bot.services.repository import Repository
from bot.services.moderator import ModerationService
import time

async def get_lang(repo, chat_id):
    settings = await repo.get_group_settings(chat_id)
    return settings.language

@admin_router.message(Command("ban"))
async def cmd_ban(message: types.Message, session):
    if message.chat.type not in ['group', 'supergroup']:
        return 
        
    repo = Repository(session)
    lang = await get_lang(repo, message.chat.id)
        
    member = await message.chat.get_member(message.from_user.id)
    if member.status not in ['administrator', 'creator']:
        return await message.reply(LocalizationService.get(lang, 'error_no_permission'))

    if not message.reply_to_message:
        return await message.reply("Reply to a user to ban.")
        
    user_to_ban = message.reply_to_message.from_user
    
    try:
        await ModerationService.punish_user(message.bot, message.chat.id, user_to_ban.id, 'ban')
        await repo.log_action(message.chat.id, user_to_ban.id, 'ban')
        
        text = LocalizationService.get(lang, 'ban_user', user=user_to_ban.full_name)
        await message.answer(text)
    except Exception as e:
        await message.reply(f"Error: {e}")

@admin_router.message(Command("unban"))
async def cmd_unban(message: types.Message, session):
    if message.chat.type not in ['group', 'supergroup']: return
    repo = Repository(session)
    lang = await get_lang(repo, message.chat.id)
    
    member = await message.chat.get_member(message.from_user.id)
    if member.status not in ['administrator', 'creator']:
        return await message.reply(LocalizationService.get(lang, 'error_no_permission'))
        
    if not message.reply_to_message: return await message.reply("Reply to user.")
    
    user = message.reply_to_message.from_user
    await message.chat.unban_member(user.id)
    await message.answer(f"User {user.full_name} unbanned.")

@admin_router.message(Command("mute"))
async def cmd_mute(message: types.Message, session):
    if message.chat.type not in ['group', 'supergroup']: return
    repo = Repository(session)
    lang = await get_lang(repo, message.chat.id)
        
    member = await message.chat.get_member(message.from_user.id)
    if member.status not in ['administrator', 'creator']:
        return await message.reply(LocalizationService.get(lang, 'error_no_permission'))

    if not message.reply_to_message:
        return await message.reply("Reply to a user to mute.")
    
    duration = 60
    args = message.text.split()
    if len(args) > 1 and args[1].isdigit():
        duration = int(args[1])
        
    user_to_mute = message.reply_to_message.from_user
    
    try:
        await ModerationService.punish_user(message.bot, message.chat.id, user_to_mute.id, 'mute', duration)
        await repo.log_action(message.chat.id, user_to_mute.id, 'mute', f"{duration}m")
        
        text = LocalizationService.get(lang, 'mute_user', user=user_to_mute.full_name, duration=duration)
        await message.answer(text)
    except Exception as e:
        await message.reply(f"Error: {e}")

@admin_router.message(Command("warn"))
async def cmd_warn(message: types.Message, session):
    if message.chat.type not in ['group', 'supergroup']: return
    repo = Repository(session)
    lang = await get_lang(repo, message.chat.id)
    
    member = await message.chat.get_member(message.from_user.id)
    if member.status not in ['administrator', 'creator']:
        return await message.reply(LocalizationService.get(lang, 'error_no_permission'))
        
    if not message.reply_to_message: return await message.reply("Reply to a user.")
    
    reason = "Admin warn"
    args = message.text.split(maxsplit=1)
    if len(args) > 1: reason = args[1]
    
    user = message.reply_to_message.from_user
    count = await repo.add_warn(message.chat.id, user.id, reason)
    
    settings = await repo.get_group_settings(message.chat.id)
    limit = settings.warn_limit
    
    if count >= limit:
        action = settings.warn_action
        await ModerationService.punish_user(message.bot, message.chat.id, user.id, action, settings.mute_duration)
        await repo.reset_warns(message.chat.id, user.id)
        await message.answer(f"User {user.full_name} reached warn limit ({limit}). Action: {action}")
    else:
        text = LocalizationService.get(lang, 'warn_user', user=user.full_name, reason=reason, count=count, limit=limit)
        await message.answer(text)

@admin_router.message(Command("settings"))
async def cmd_settings(message: types.Message, session):
    if message.chat.type not in ['group', 'supergroup']: return
    repo = Repository(session)
    
    member = await message.chat.get_member(message.from_user.id)
    if member.status not in ['administrator', 'creator']:
        return 
        
    settings = await repo.get_group_settings(message.chat.id)
    text = (f"<b>Settings:</b>\n"
            f"Lang: {settings.language}\n"
            f"Links: {'✅' if settings.delete_links else '❌'}\n"
            f"Forwards: {'✅' if settings.delete_forwards else '❌'}\n"
            f"Spam: {'✅' if settings.anti_spam_enabled else '❌'}\n"
            f"Warns: {settings.warn_limit} (Action: {settings.warn_action})")
            
    await message.answer(text)
