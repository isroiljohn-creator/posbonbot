"""
Manual script to add a group to the database
Run this on Railway or locally with DATABASE_URL set
"""
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database models
from bot.database.models import Base, Group, User

async def add_group():
    database_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./posbon.db")
    
    # Fix postgres URL if needed
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    engine = create_async_engine(database_url, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Check if user exists
        user_id = 1392501306
        user = await session.get(User, user_id)
        if not user:
            user = User(
                id=user_id,
                username="user",
                full_name="User",
                language="uz"
            )
            session.add(user)
            await session.commit()
            print(f"✅ Created user {user_id}")
        
        # Check if group already exists
        group_id = -1002178859034
        existing_group = await session.get(Group, group_id)
        
        if existing_group:
            print(f"⚠️  Group {group_id} already exists!")
            print(f"Title: {existing_group.title}")
            print(f"Owner: {existing_group.owner_id}")
        else:
            # Create group
            group = Group(
                id=group_id,
                title="AI EXPERTS - AI hamjamiyati",
                owner_id=user_id,
                is_premium=False
            )
            session.add(group)
            await session.commit()
            print(f"✅ Created group {group_id}")
            print(f"Title: {group.title}")
            print(f"Owner: {group.owner_id}")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(add_group())
