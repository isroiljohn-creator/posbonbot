import { useState, useCallback, useEffect } from 'react';
import {
  AdminUser,
  Subscription,
  Group,
  GroupSettings,
  ForbiddenWord,
  ModerationLog,
  SlotOverview
} from '@/types';
import { Language } from '@/i18n';

// Mock data for demonstration
const mockGroups: Group[] = [
  {
    id: '1',
    telegramId: -1001234567890,
    title: 'Uzbek Tech Community',
    username: 'uztech',
    memberCount: 15420,
    isBound: true,
    isPremium: true,
    adsExempt: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    telegramId: -1001234567891,
    title: 'Tashkent Developers',
    username: 'tashdev',
    memberCount: 8750,
    isBound: true,
    isPremium: true,
    adsExempt: true,
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    telegramId: -1001234567892,
    title: 'Crypto Uzbekistan',
    memberCount: 23100,
    isBound: false,
    isPremium: false,
    adsExempt: false,
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: '4',
    telegramId: -1001234567893,
    title: 'Startup Hub UZ',
    username: 'startuphub_uz',
    memberCount: 5600,
    isBound: false,
    isPremium: false,
    adsExempt: false,
    createdAt: '2024-03-25T16:45:00Z',
  },
];

const mockSettings: Record<string, GroupSettings> = {
  '1': {
    id: 's1',
    groupId: '1',
    deleteLinks: true,
    deleteMentions: false,
    deleteForwarded: true,
    allowPhotos: true,
    allowVideos: true,
    allowStickers: true,
    allowGifs: false,
    floodControlEnabled: true,
    floodMessagesLimit: 5,
    floodIntervalSeconds: 10,
    duplicateDetection: true,
    warnSystemEnabled: true,
    warnLimit: 3,
    actionOnLimit: 'mute',
    captchaEnabled: true,
    captchaType: 'button',
    captchaTimeoutSeconds: 60,
    captchaFailAction: 'kick',
    newUserReadOnly: true,
    readOnlyDurationSeconds: 300,
    silentMode: false,
    botLanguage: 'uz',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  '2': {
    id: 's2',
    groupId: '2',
    deleteLinks: true,
    deleteMentions: true,
    deleteForwarded: false,
    allowPhotos: true,
    allowVideos: false,
    allowStickers: true,
    allowGifs: true,
    floodControlEnabled: true,
    floodMessagesLimit: 10,
    floodIntervalSeconds: 30,
    duplicateDetection: false,
    warnSystemEnabled: true,
    warnLimit: 5,
    actionOnLimit: 'kick',
    captchaEnabled: true,
    captchaType: 'math',
    captchaTimeoutSeconds: 90,
    captchaFailAction: 'mute',
    newUserReadOnly: false,
    readOnlyDurationSeconds: 0,
    silentMode: true,
    botLanguage: 'ru',
    updatedAt: '2024-06-15T08:30:00Z',
  },
};

const mockLogs: ModerationLog[] = [
  {
    id: 'l1',
    groupId: '1',
    userId: 123456789,
    username: 'spammer_user',
    action: 'delete',
    reason: 'link',
    details: 'Deleted message containing external link',
    createdAt: '2024-06-20T14:30:00Z',
  },
  {
    id: 'l2',
    groupId: '1',
    userId: 987654321,
    username: 'new_member',
    action: 'kick',
    reason: 'captcha_fail',
    details: 'Failed to complete captcha within timeout',
    createdAt: '2024-06-20T14:25:00Z',
  },
  {
    id: 'l3',
    groupId: '2',
    userId: 456789123,
    username: 'flood_user',
    action: 'mute',
    reason: 'flood',
    details: 'Exceeded message limit: 12 messages in 10 seconds',
    createdAt: '2024-06-20T14:20:00Z',
  },
  {
    id: 'l4',
    groupId: '1',
    userId: 789123456,
    action: 'warn',
    reason: 'forbidden_word',
    details: 'Used forbidden word from "scam" category',
    createdAt: '2024-06-20T14:15:00Z',
  },
  {
    id: 'l5',
    groupId: '2',
    userId: 321654987,
    username: 'crypto_scam',
    action: 'ban',
    reason: 'spam',
    details: 'Repeated spam after 3 warnings',
    createdAt: '2024-06-20T14:10:00Z',
  },
];

const mockForbiddenWords: Record<string, ForbiddenWord[]> = {
  '1': [
    { id: 'w1', groupId: '1', word: 'scam', category: 'scam', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'w2', groupId: '1', word: 'crypto investment', category: 'crypto', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'w3', groupId: '1', word: 'free money', category: 'scam', createdAt: '2024-01-01T00:00:00Z' },
  ],
  '2': [
    { id: 'w4', groupId: '2', word: 'блять', category: 'swear', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'w5', groupId: '2', word: 'мошенничество', category: 'scam', createdAt: '2024-01-01T00:00:00Z' },
  ],
};

export function useAdminData() {
  const [user] = useState<AdminUser>({
    id: 'u1',
    telegramId: 12345678,
    username: 'admin_user',
    firstName: 'Admin',
    lastName: 'User',
    language: 'ru',
    createdAt: '2024-01-01T00:00:00Z',
  });

  const [subscription] = useState<Subscription>({
    id: 'sub1',
    userId: 'u1',
    plan: 'pro',
    totalSlots: 5,
    usedSlots: 2,
    expiresAt: '2025-01-01T00:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  });

  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [settings, setSettings] = useState<Record<string, GroupSettings>>(mockSettings);
  const [logs] = useState<ModerationLog[]>(mockLogs);
  const [forbiddenWords, setForbiddenWords] = useState<Record<string, ForbiddenWord[]>>(mockForbiddenWords);

  // Fetch settings from API on load (Sync)
  useEffect(() => {
    import('@/lib/api').then(({ fetchGroupSettings }) => {
      groups.forEach(async (group) => {
        try {
          const apiSettings = await fetchGroupSettings(group.id);
          setSettings(prev => ({ ...prev, [group.id]: apiSettings }));
        } catch (e) {
          // Ignore errors for logs/mocks that don't exist in backend yet
          console.log(`No settings for group ${group.id}`);
        }
      });
    });
  }, []);

  const slotOverview: SlotOverview = {
    total: subscription.totalSlots,
    used: subscription.usedSlots,
    free: subscription.totalSlots - subscription.usedSlots,
  };

  const boundGroups = groups.filter(g => g.isBound);
  const unboundGroups = groups.filter(g => !g.isBound);

  const bindGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, isBound: true, isPremium: true, adsExempt: true }
        : g
    ));
  }, []);

  const unbindGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, isBound: false, isPremium: false, adsExempt: false }
        : g
    ));
  }, []);

  const getGroupSettings = useCallback((groupId: string): GroupSettings | undefined => {
    return settings[groupId];
  }, [settings]);

  const updateGroupSettings = useCallback((groupId: string, newSettings: Partial<GroupSettings>) => {
    // Optimistic update
    setSettings(prev => ({
      ...prev,
      [groupId]: prev[groupId]
        ? { ...prev[groupId], ...newSettings, updatedAt: new Date().toISOString() }
        : {
          id: `s${groupId}`,
          groupId,
          deleteLinks: false,
          ...newSettings
        } as GroupSettings,
    }));

    // API Call
    import('@/lib/api').then(({ updateGroupSettings }) => {
      updateGroupSettings(groupId, newSettings).catch(e => {
        console.error(e);
        // Revert on error? For prototype, just log.
      });
    });
  }, []);

  const getGroupLogs = useCallback((groupId?: string) => {
    if (!groupId) return logs;
    return logs.filter(l => l.groupId === groupId);
  }, [logs]);

  const getGroupForbiddenWords = useCallback((groupId: string) => {
    return forbiddenWords[groupId] || [];
  }, [forbiddenWords]);

  const addForbiddenWord = useCallback((groupId: string, word: string, category: ForbiddenWord['category']) => {
    const newWord: ForbiddenWord = {
      id: `w${Date.now()}`,
      groupId,
      word,
      category,
      createdAt: new Date().toISOString(),
    };
    setForbiddenWords(prev => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newWord],
    }));
  }, []);

  const removeForbiddenWord = useCallback((groupId: string, wordId: string) => {
    setForbiddenWords(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(w => w.id !== wordId),
    }));
  }, []);

  return {
    user,
    subscription,
    groups,
    boundGroups,
    unboundGroups,
    slotOverview,
    bindGroup,
    unbindGroup,
    getGroupSettings,
    updateGroupSettings,
    getGroupLogs,
    getGroupForbiddenWords,
    addForbiddenWord,
    removeForbiddenWord,
    logs,
  };
}
