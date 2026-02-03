from aiogram import Router

# Shared routers export
group_router = Router()
admin_router = Router()
private_router = Router()
owner_router = Router()
new_member_router = Router()

# Import handlers to register them
from . import group, admin, private, owner, new_member
