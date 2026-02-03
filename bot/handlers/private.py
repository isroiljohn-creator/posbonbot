from aiogram import Router, types
from aiogram.filters import CommandStart
from bot.handlers import private_router
from bot.locales.i18n import LocalizationService

@private_router.message(CommandStart())
async def cmd_start(message: types.Message, session, lang):
    # Upsert user
    from bot.database.models import User
    from sqlalchemy.dialects.postgresql import insert as pg_insert 
    # Note: sqlite doesn't support pg_insert fully generic, using simple merge for now or check/create
    
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
    await message.answer(text)
