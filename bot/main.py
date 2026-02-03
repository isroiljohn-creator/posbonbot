import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from bot.database.core import engine, Base
from bot.handlers import group_router, admin_router, private_router, owner_router, new_member_router
from config import BOT_TOKEN

async def on_startup():
    # Create DB tables (Quick & Dirty for prototype)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

from bot.middlewares.db import DbSessionMiddleware
from bot.middlewares.i18n import I18nMiddleware

async def main():
    logging.basicConfig(level=logging.INFO)
    
    bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()
    
    # Global Middlewares
    dp.update.outer_middleware(DbSessionMiddleware())
    dp.message.middleware(I18nMiddleware())
    dp.callback_query.middleware(I18nMiddleware())
    
    # Include routers
    dp.include_router(owner_router) # High priority
    dp.include_router(new_member_router) # Captcha traps
    dp.include_router(private_router)
    dp.include_router(admin_router)
    dp.include_router(group_router)
    
    dp.startup.register(on_startup)
    
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
