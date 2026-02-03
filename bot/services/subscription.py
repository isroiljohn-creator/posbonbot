from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from bot.database.models import User, Group

class SubscriptionService:
    @staticmethod
    async def get_user_subscription(session: AsyncSession, user_id: int):
        stmt = select(User).where(User.id == user_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
        
    @staticmethod
    async def can_add_group(session: AsyncSession, user_id: int) -> bool:
        """
        Check if user has slots available.
        """
        user = await SubscriptionService.get_user_subscription(session, user_id)
        if not user:
            # Create user on fly or return False
            return False 
            
        # Count groups
        stmt = select(func.count(Group.id)).where(Group.owner_id == user_id)
        result = await session.execute(stmt)
        group_count = result.scalar()
        
        return group_count < user.slots_limit

    @staticmethod
    async def is_premium_slot(session: AsyncSession, group_id: int) -> bool:
        """
        Check if the group benefits from premium features.
        """
        stmt = select(Group).where(Group.id == group_id)
        result = await session.execute(stmt)
        group = result.scalar_one_or_none()
        
        if not group: 
            return False
            
        return group.is_premium
