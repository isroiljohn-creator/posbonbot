# Bot Setup Instructions

## BotFather Configuration (CRITICAL)

To enable WebApp functionality, you MUST configure the Mini App in BotFather:

1. Open [@BotFather](https://t.me/BotFather)
2. Send `/mybots`
3. Select your bot: `@PosbonAI_Bot`
4. Click **Bot Settings**
5. Click **Menu Button**
6. Click **Edit Menu Button URL**
7. Enter: `https://posbonbot-production.up.railway.app`
8. Click **Configure Web App** (if available)

This will register your domain with Telegram and enable WebApp buttons.

## Alternative: Remove WebApp Button

If BotFather setup fails, we can use a regular URL button (opens in browser).

---

**Current Issue:** `BUTTON_TYPE_INVALID` 
**Cause:** WebApp domain not registered with BotFather
**Solution:** Follow steps above
