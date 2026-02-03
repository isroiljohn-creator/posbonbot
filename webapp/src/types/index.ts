import { Language } from '@/i18n';

// Types for the admin panel

export interface AdminUser {
  id: string;
  telegramId: number;
  username: string;
  firstName: string;
  lastName?: string;
  language: Language;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'pro' | 'enterprise';
  totalSlots: number;
  usedSlots: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface Group {
  id: string;
  telegramId: number;
  title: string;
  username?: string;
  memberCount: number;
  isBound: boolean;
  isPremium: boolean;
  adsExempt: boolean;
  createdAt: string;
}

export interface GroupBinding {
  id: string;
  groupId: string;
  subscriptionId: string;
  slotIndex: number;
  boundAt: string;
}

export interface GroupSettings {
  id: string;
  groupId: string;
  
  // Moderation
  deleteLinks: boolean;
  deleteMentions: boolean;
  deleteForwarded: boolean;
  allowPhotos: boolean;
  allowVideos: boolean;
  allowStickers: boolean;
  allowGifs: boolean;
  
  // Anti-spam
  floodControlEnabled: boolean;
  floodMessagesLimit: number;
  floodIntervalSeconds: number;
  duplicateDetection: boolean;
  warnSystemEnabled: boolean;
  warnLimit: number;
  actionOnLimit: 'mute' | 'kick';
  
  // Captcha
  captchaEnabled: boolean;
  captchaType: 'button' | 'math';
  captchaTimeoutSeconds: number;
  captchaFailAction: 'kick' | 'mute';
  newUserReadOnly: boolean;
  readOnlyDurationSeconds: number;
  
  // Bot behavior
  silentMode: boolean;
  botLanguage: Language;
  
  updatedAt: string;
}

export interface ForbiddenWord {
  id: string;
  groupId: string;
  word: string;
  category: 'swear' | 'scam' | 'crypto' | 'custom';
  createdAt: string;
}

export interface ModerationLog {
  id: string;
  groupId: string;
  userId: number;
  username?: string;
  action: 'delete' | 'warn' | 'mute' | 'kick' | 'ban';
  reason: 'link' | 'spam' | 'forbidden_word' | 'captcha_fail' | 'flood' | 'duplicate';
  details?: string;
  createdAt: string;
}

export interface SlotOverview {
  total: number;
  used: number;
  free: number;
}

export interface SubscriptionPlan {
  id: 'basic' | 'pro' | 'enterprise';
  name: string;
  price: number;
  slots: number;
  features: string[];
}
