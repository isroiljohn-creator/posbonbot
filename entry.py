import asyncio
import logging
import sys
import uvicorn
from bot.main import main as bot_main
from bot.api.server import app

# Configure logging
logging.basicConfig(level=logging.INFO, stream=sys.stdout)

async def start_api():
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

async def main():
    # Run API and Bot concurrently
    await asyncio.gather(
        bot_main(),
        start_api()
    )

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped!")
