from typing import Callable, Dict, Any, Awaitable
from aiogram import BaseMiddleware
from aiogram.types import TelegramObject, Message, CallbackQuery
from sqlalchemy import select
from bot.database.models import User, GroupSettings

class I18nMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: Dict[str, Any]
    ) -> Any:
        session = data.get("session")
        if not session:
            return await handler(event, data)

        # Default lang
        lang = 'uz'
        
        # Logic to fetch lang from DB based on event type
        # For groups: fetch GroupSettings
        # For private: fetch User
        
        user = data.get("event_from_user")
        chat = data.get("event_chat")
        
        if chat and chat.type in ['group', 'supergroup']:
            stmt = select(GroupSettings).where(GroupSettings.group_id == chat.id)
            result = await session.execute(stmt)
            settings = result.scalar_one_or_none()
            if settings:
                lang = settings.language
        elif user:
            # Check user prefs (cached or db)
            # For prototype, we default to 'uz' or simple check
            pass
            
        data["lang"] = lang
        return await handler(event, data)
