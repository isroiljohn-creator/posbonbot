# PosbonBot & Mini App

Telegram Moderator bot with Admin Dashboard (Mini App).

## 🚀 Deployment (Railway)

1. **Fork/Clone** this repository to GitHub.
2. **Create New Project** in Railway and link the repo.
3. **Add PostgreSQL Database** (New -> Database -> PostgreSQL).
4. **Set Environment Variables**:
   - `BOT_TOKEN`: Get from @BotFather.
   - `WEBAPP_URL`: Your Railway domain (e.g. `https://group-guardian-hub-production.up.railway.app`).
   - `DATABASE_URL`: (Auto-set by Railway).
   - `ADMIN_IDS`: comma separated IDs (e.g. `12345678,87654321`).

5. **Deploy!**

### Troubleshooting
- **404 Not Found**: Ensure `WEBAPP_URL` matches your actual Railway domain exactly (https://...).
- **Port Error**: Verify `PORT` variable is set by Railway (automatic).
- **Stale Bot Instances**: If old bot is still replying, revoke the old token via @BotFather and generate a new one. Update `BOT_TOKEN` in Railway.
