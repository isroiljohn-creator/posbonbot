from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from bot.database.models import User, Group, GroupSettings, ModerationLog, Warn

class Repository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def upsert_user(self, user_id: int, username: str = None, full_name: str = None, language: str = 'uz') -> User:
        user = await self.session.get(User, user_id)
        if not user:
            user = User(id=user_id, username=username, full_name=full_name, language=language)
            self.session.add(user)
        else:
            if username: user.username = username
            if full_name: user.full_name = full_name
            # language is not overwritten unless explicitly requested via settings
        await self.session.commit()
        return user

    async def get_user(self, user_id: int) -> User:
        return await self.session.get(User, user_id)

    async def get_group_settings(self, group_id: int) -> GroupSettings:
        stmt = select(GroupSettings).where(GroupSettings.group_id == group_id)
        result = await self.session.execute(stmt)
        settings = result.scalar_one_or_none()
        
        if not settings:
            # Check if group exists
            group = await self.session.get(Group, group_id)
            if not group:
                # Create a group placeholder without owner (will be updated when bot is added or active)
                group = Group(id=group_id, title="Unknown Group", owner_id=None)
                self.session.add(group)
                await self.session.flush() # User flush to get ID availability
            
            settings = GroupSettings(group_id=group_id)
            self.session.add(settings)
            await self.session.commit()
                
        return settings

    async def get_groups_by_owner(self, owner_id: int) -> list[Group]:
        stmt = select(Group).where(Group.owner_id == owner_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_or_create_group(self, group_id: int, title: str, owner_id: int) -> Group:
        group = await self.session.get(Group, group_id)
        if not group:
            group = Group(id=group_id, title=title, owner_id=owner_id)
            self.session.add(group)
            
            # Create default settings
            settings = GroupSettings(group_id=group_id)
            self.session.add(settings)
            
            await self.session.commit()
        else:
            if title and group.title != title:
                group.title = title
                await self.session.commit()
        return group

    async def log_action(self, group_id: int, user_id: int, action: str, reason: str = None):
        log = ModerationLog(group_id=group_id, user_id=user_id, action=action, reason=reason)
        self.session.add(log)
        await self.session.commit()

    async def add_warn(self, group_id: int, user_id: int, reason: str = None) -> int:
        """Add warn and return new count"""
        stmt = select(Warn).where(Warn.group_id == group_id, Warn.user_id == user_id)
        result = await self.session.execute(stmt)
        warn = result.scalar_one_or_none()
        
        if warn:
            warn.count += 1
            warn.reason = reason # Update reason to latest
            new_count = warn.count
        else:
            warn = Warn(group_id=group_id, user_id=user_id, count=1, reason=reason)
            self.session.add(warn)
            new_count = 1
            
        await self.session.commit()
        return new_count

    async def reset_warns(self, group_id: int, user_id: int):
        stmt = delete(Warn).where(Warn.group_id == group_id, Warn.user_id == user_id)
        await self.session.execute(stmt)
        await self.session.commit()
