from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from bot.database.core import async_session_maker
from bot.database.models import GroupSettings, Group
from bot.services.repository import Repository
from typing import List, Optional

app = FastAPI()

# CORS for Mini App (allow all for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for DB session
async def get_db():
    async with async_session_maker() as session:
        yield session

class SettingsUpdate(BaseModel):
    deleteLinks: Optional[bool] = None
    deleteMentions: Optional[bool] = None
    deleteForwarded: Optional[bool] = None
    allowPhotos: Optional[bool] = None
    allowVideos: Optional[bool] = None
    allowStickers: Optional[bool] = None
    allowGifs: Optional[bool] = None
    
    floodControlEnabled: Optional[bool] = None
    floodMessagesLimit: Optional[int] = None
    floodIntervalSeconds: Optional[int] = None
    duplicateDetection: Optional[bool] = None
    
    warnSystemEnabled: Optional[bool] = None
    warnLimit: Optional[int] = None
    
    captchaEnabled: Optional[bool] = None
    captchaType: Optional[str] = None
    captchaTimeoutSeconds: Optional[int] = None
    captchaFailAction: Optional[str] = None
    
    newUserReadOnly: Optional[bool] = None
    readOnlyDurationSeconds: Optional[int] = None
    
    silentMode: Optional[bool] = None
    botLanguage: Optional[str] = None

@app.get("/api/groups")
async def get_groups(userId: int, db: AsyncSession = Depends(get_db)):
    repo = Repository(db)
    groups = await repo.get_groups_by_owner(userId)
    return [
        {
            "id": str(g.id),
            "telegramId": g.id,
            "title": g.title,
            "username": None, # Not tracking username currently
            "memberCount": 0, # Not tracking currently
            "isBound": True,
            "isPremium": g.is_premium,
            "adsExempt": g.is_premium,
            "createdAt": g.created_at.isoformat() if g.created_at else None
        }
        for g in groups
    ]

class GroupCreate(BaseModel):
    groupId: int
    title: str
    ownerId: int

@app.post("/api/groups")
async def create_group(data: GroupCreate, db: AsyncSession = Depends(get_db)):
    """Manually add a group to database"""
    repo = Repository(db)
    
    # Check if group already exists
    existing = await db.get(Group, data.groupId)
    if existing:
        return {"status": "exists", "message": "Group already exists"}
    
    # Create group
    group = await repo.get_or_create_group(
        group_id=data.groupId,
        title=data.title,
        owner_id=data.ownerId
    )
    
    return {
        "status": "created",
        "group": {
            "id": str(group.id),
            "title": group.title,
            "ownerId": group.owner_id
        }
    }

@app.get("/api/groups/{group_id}/settings")
async def get_settings(group_id: int, db: AsyncSession = Depends(get_db)):
    repo = Repository(db)
    settings = await repo.get_group_settings(group_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
        
    return {
        "id": f"s{group_id}",
        "groupId": str(group_id),
        "deleteLinks": settings.delete_links,
        "deleteMentions": settings.delete_mentions,
        "deleteForwarded": settings.delete_forwards,
        "allowPhotos": settings.allow_photos,
        "allowVideos": settings.allow_videos,
        "allowStickers": settings.allow_stickers,
        "allowGifs": settings.allow_gifs,
        "floodControlEnabled": settings.anti_spam_enabled,
        "floodMessagesLimit": settings.flood_threshold,
        "floodIntervalSeconds": settings.flood_period,
        "duplicateDetection": settings.duplicate_detection,
        "warnSystemEnabled": True, # Always on in backend logic for now, toggle controls logic
        "warnLimit": settings.warn_limit,
        "actionOnLimit": settings.warn_action,
        "captchaEnabled": settings.captcha_enabled,
        "captchaType": settings.captcha_type,
        "captchaTimeoutSeconds": settings.captcha_timeout,
        "captchaFailAction": settings.captcha_fail_action,
        "newUserReadOnly": settings.new_user_read_only,
        "readOnlyDurationSeconds": settings.read_only_duration,
        "silentMode": settings.silent_mode,
        "botLanguage": settings.language,
        "updatedAt": "2024-01-01T00:00:00Z" # TODO: Add updated_at to model
    }

@app.post("/api/groups/{group_id}/settings")
async def update_settings(group_id: int, data: SettingsUpdate, db: AsyncSession = Depends(get_db)):
    repo = Repository(db)
    settings = await repo.get_group_settings(group_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
        
    # Mapping
    if data.deleteLinks is not None: settings.delete_links = data.deleteLinks
    if data.deleteMentions is not None: settings.delete_mentions = data.deleteMentions
    if data.deleteForwarded is not None: settings.delete_forwards = data.deleteForwarded
    
    if data.allowPhotos is not None: settings.allow_photos = data.allowPhotos
    if data.allowVideos is not None: settings.allow_videos = data.allowVideos
    if data.allowStickers is not None: settings.allow_stickers = data.allowStickers
    if data.allowGifs is not None: settings.allow_gifs = data.allowGifs
    
    if data.floodControlEnabled is not None: settings.anti_spam_enabled = data.floodControlEnabled
    if data.floodMessagesLimit is not None: settings.flood_threshold = data.floodMessagesLimit
    if data.floodIntervalSeconds is not None: settings.flood_period = data.floodIntervalSeconds
    if data.duplicateDetection is not None: settings.duplicate_detection = data.duplicateDetection
    
    if data.warnLimit is not None: settings.warn_limit = data.warnLimit
    
    if data.captchaEnabled is not None: settings.captcha_enabled = data.captchaEnabled
    if data.captchaType is not None: settings.captcha_type = data.captchaType
    if data.captchaTimeoutSeconds is not None: settings.captcha_timeout = data.captchaTimeoutSeconds
    if data.captchaFailAction is not None: settings.captcha_fail_action = data.captchaFailAction
    
    if data.newUserReadOnly is not None: settings.new_user_read_only = data.newUserReadOnly
    if data.readOnlyDurationSeconds is not None: settings.read_only_duration = data.readOnlyDurationSeconds
    
    if data.silentMode is not None: settings.silent_mode = data.silentMode
    if data.botLanguage is not None: settings.language = data.botLanguage

    await db.commit()
    return {"status": "ok"}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Mount static assets
if os.path.exists("webapp/dist/assets"):
    app.mount("/assets", StaticFiles(directory="webapp/dist/assets"), name="assets")

# Serve index.html for root and other routes (SPA)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    index_path = "webapp/dist/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Frontend not built or not found. Please run build."}
