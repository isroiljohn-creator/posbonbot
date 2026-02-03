from aiogram import Router, types, F
from aiogram.filters import Command
from config import ADMIN_IDS

owner_router = Router()

@owner_router.message(Command("broadcast"), F.from_user.id.in_(ADMIN_IDS))
async def cmd_broadcast(message: types.Message):
    """
    Broadcast command for Bot Owner.
    Usage: /broadcast <text>
    """
    args = message.text.split(" ", 1)
    if len(args) < 2:
        return await message.reply("Usage: /broadcast <message>")
    
    markup_text = args[1]
    
    # In a real app, this would iterate over all users in DB
    # For now, just echo confirmation
    await message.reply(f"Started broadcast to generic users: {markup_text}\n(Note: DB iteration not implemented in prototype)")
