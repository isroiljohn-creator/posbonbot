# Railway PostgreSQL Setup

## Current Issue
SQLite database gets deleted on every deployment because Railway containers are ephemeral.

## Solution: PostgreSQL Database

### Step 1: Add PostgreSQL Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Open your `posbonbot` project
3. Click **New** → **Database** → **Add PostgreSQL**
4. Railway will automatically:
   - Create PostgreSQL service
   - Set `DATABASE_URL` environment variable
   - Connect it to your bot service

### Step 2: Verify DATABASE_URL

After adding PostgreSQL:

1. Go to your bot service → **Variables** tab
2. Check that `DATABASE_URL` exists
3. It should look like: `postgres://user:pass@host:port/dbname`

### Step 3: Redeploy Bot

1. Go to **Deployments** tab
2. Click **Deploy** (or push code to trigger auto-deploy)
3. Check logs for:
   ```
   INFO: Creating tables...
   INFO: Database connected successfully
   ```

### Step 4: Verify Persistence

After deployment:
```bash
# Add group
curl -X POST "https://posbonbot-production.up.railway.app/api/groups" \
  -H "Content-Type: application/json" \
  -d '{"groupId": -1002178859034, "title": "AI EXPERTS - AI hamjamiyati", "ownerId": 1392501306}'

# Verify
curl "https://posbonbot-production.up.railway.app/api/groups?userId=1392501306"
```

Redeploy again and check - group should still exist!

## Code Already Ready

✅ `config.py` automatically converts `postgres://` to `postgresql+asyncpg://`  
✅ All models use async SQLAlchemy  
✅ No code changes needed

## Troubleshooting

### If tables don't auto-create:

Check `bot/main.py` startup:
```python
async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
```

This should run on first startup.

### If DATABASE_URL not set:

Railway might not have auto-linked. Manually add in Variables:
- Key: `DATABASE_URL`
- Value: Get from PostgreSQL service details
