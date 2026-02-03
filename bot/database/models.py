from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, BigInteger, Text, ARRAY, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from bot.database.core import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(BigInteger, primary_key=True)  # Telegram User ID
    username = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    language = Column(String, default='uz')  # 'uz' or 'ru'
    is_admin = Column(Boolean, default=False) # Bot admin
    is_bot_owner = Column(Boolean, default=False)
    
    # Subscription info
    plan_type = Column(String, default='free') # free, premium
    slots_limit = Column(Integer, default=1)
    sub_expires_at = Column(DateTime, nullable=True)
    
    groups = relationship("Group", back_populates="owner")

class Group(Base):
    __tablename__ = 'groups'
    
    id = Column(BigInteger, primary_key=True) # Telegram Chat ID (usually negative)
    title = Column(String, nullable=True)
    owner_id = Column(BigInteger, ForeignKey('users.id'))
    
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="groups")
    settings = relationship("GroupSettings", uselist=False, back_populates="group")
    warns = relationship("Warn", back_populates="group", cascade="all, delete-orphan")

class GroupSettings(Base):
    __tablename__ = 'group_settings'
    
    group_id = Column(BigInteger, ForeignKey('groups.id'), primary_key=True)
    
    language = Column(String, default='uz')
    
    # Moderation Toggles
    delete_links = Column(Boolean, default=True)
    delete_forwards = Column(Boolean, default=True)
    delete_mentions = Column(Boolean, default=False)
    forbidden_words = Column(JSON, default=list) # List of strings
    
    # Spam/Flood
    anti_spam_enabled = Column(Boolean, default=True)
    # Flood settings (e.g. 5 msgs in 3 sec)
    flood_threshold = Column(Integer, default=5)
    flood_period = Column(Integer, default=5) 
    
    # Captcha
    captcha_enabled = Column(Boolean, default=False)
    captcha_timeout = Column(Integer, default=60) # seconds
    
    # Warn System
    warn_limit = Column(Integer, default=3)
    warn_action = Column(String, default='mute') # kick, ban, mute
    mute_duration = Column(Integer, default=60) # minutes
    
    group = relationship("Group", back_populates="settings")

class Warn(Base):
    __tablename__ = 'warns'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(BigInteger, ForeignKey('groups.id'))
    user_id = Column(BigInteger)
    reason = Column(String, nullable=True)
    count = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    group = relationship("Group", back_populates="warns")

class ModerationLog(Base):
    __tablename__ = 'moderation_logs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(BigInteger, ForeignKey('groups.id'))
    user_id = Column(BigInteger)
    action = Column(String) # kick, ban, mute, warn, delete
    reason = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
