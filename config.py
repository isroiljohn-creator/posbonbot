import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_IDS = [int(x) for x in os.getenv("ADMIN_IDS", "").split(",") if x.strip()]
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///bot.db") # Default to sqlite for ease of running now, or keep postgres if preferred
# However, user asked for "Data Layer (Database & Redis)"... "PostgreSQL". 
# I'll stick to the original plan of Postgres or fallback to sqlite if they don't have it running. 
# For this specific "scratch" environment, sqlite is often safer unless I know pg is running.
# But I will stick to the code in models.py which used sqlite/postgres compatible base.
# Let's check models.py first.
