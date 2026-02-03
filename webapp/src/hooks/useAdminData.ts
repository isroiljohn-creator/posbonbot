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
// import { Language } from '@/i18n';

// Mock data removed
const mockGroups: Group[] = [];
const mockSettings: Record<string, GroupSettings> = {};
const mockLogs: ModerationLog[] = [];
const mockForbiddenWords: Record<string, ForbiddenWord[]> = {};

export function useAdminData() {
  // Get Telegram User
  const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
  const userId = tgUser?.id;

  const [user] = useState<AdminUser>({
    id: userId ? String(userId) : 'u1',
    telegramId: userId || 0,
    username: tgUser?.username || 'user',
    firstName: tgUser?.first_name || 'User',
    lastName: tgUser?.last_name || '',
    language: tgUser?.language_code || 'uz',
    createdAt: new Date().toISOString(),
  });

  const [subscription] = useState<Subscription>({
    id: 'sub1',
    userId: String(userId),
    plan: 'free', // Default to free for now
    totalSlots: 1,
    usedSlots: 0,
    expiresAt: '2099-01-01T00:00:00Z',
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  const [groups, setGroups] = useState<Group[]>([]);
  const [settings, setSettings] = useState<Record<string, GroupSettings>>({});
  const [logs] = useState<ModerationLog[]>([]);
  const [forbiddenWords, setForbiddenWords] = useState<Record<string, ForbiddenWord[]>>({});

  // Fetch groups and settings from API on load
  useEffect(() => {
    if (!userId) {
      console.warn("No Telegram User ID found. Running in dev mode or outside Telegram?");
      return;
    }

    import('@/lib/api').then(({ fetchGroups, fetchGroupSettings }) => {
      // 1. Fetch Groups
      fetchGroups(userId).then(apiGroups => {
        setGroups(apiGroups);

        // 2. Fetch Settings for each group
        apiGroups.forEach(async (group: Group) => {
          try {
            const apiSettings = await fetchGroupSettings(group.id);
            setSettings(prev => ({ ...prev, [group.id]: apiSettings }));
          } catch (e) {
            console.log(`No settings for group ${group.id}`);
          }
        });
      }).catch(e => console.error("Failed to fetch groups", e));
    });
  }, [userId]);

  const slotOverview: SlotOverview = {
    total: subscription.totalSlots,
    used: groups.length, // approximation
    free: Math.max(0, subscription.totalSlots - groups.length),
  };

  const boundGroups = groups.filter(g => g.isBound);
  const unboundGroups = groups.filter(g => !g.isBound);

  const bindGroup = useCallback((groupId: string) => {
    // Logic to bind group via API if needed, or just UI update
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, isBound: true }
        : g
    ));
  }, []);

  const unbindGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, isBound: false }
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
