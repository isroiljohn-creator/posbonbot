from aiogram import Router, types, Bot
import os
from aiogram.filters import CommandStart
from bot.handlers import private_router
from bot.locales.i18n import LocalizationService

@private_router.message(CommandStart())
async def cmd_start(message: types.Message, session, lang, bot: Bot):
    # Upsert user
    from bot.database.models import User
    
    # Simple check and create for both sqlite/pg compatibility in this prototype
    user = await session.get(User, message.from_user.id)
    if not user:
        user = User(
            id=message.from_user.id,
            username=message.from_user.username,
            full_name=message.from_user.full_name,
            language=message.from_user.language_code or 'uz'
        )
        session.add(user)
        try:
            await session.commit()
        except:
            await session.rollback()
            
    text = LocalizationService.get(lang, 'welcome')
    
    # Create Inline Keyboard
    kb = types.InlineKeyboardMarkup(inline_keyboard=[
        [
            types.InlineKeyboardButton(text="➕ Guruhga qo'shish", url=f"https://t.me/{bot.token.split(':')[0]}?startgroup=true"),
        ],
        [
            types.InlineKeyboardButton(text="⚙️ Konstruktor", web_app=types.WebAppInfo(url=os.getenv("WEBAPP_URL", "https://group-guardian-hub-production.up.railway.app")))
        ],
        [
            types.InlineKeyboardButton(text="📢 Yangiliklar", url="https://t.me/isroiljohn_channel"),
            types.InlineKeyboardButton(text="📚 Yordam", callback_data="help")
        ]
    ])
    
    # Update URL to be dynamic if possible, or hardcode verified username
    bot_user = await bot.get_me()
    kb.inline_keyboard[0][0].url = f"https://t.me/{bot_user.username}?startgroup=true"

    await message.answer(text, reply_markup=kb)
