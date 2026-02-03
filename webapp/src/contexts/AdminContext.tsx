import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { AdminUser, Subscription, Group, GroupSettings, ForbiddenWord, ModerationLog, SlotOverview } from '@/types';

interface AdminContextType {
  user: AdminUser;
  subscription: Subscription;
  groups: Group[];
  boundGroups: Group[];
  unboundGroups: Group[];
  slotOverview: SlotOverview;
  bindGroup: (groupId: string) => void;
  unbindGroup: (groupId: string) => void;
  getGroupSettings: (groupId: string) => GroupSettings | undefined;
  updateGroupSettings: (groupId: string, settings: Partial<GroupSettings>) => void;
  getGroupLogs: (groupId?: string) => ModerationLog[];
  getGroupForbiddenWords: (groupId: string) => ForbiddenWord[];
  addForbiddenWord: (groupId: string, word: string, category: ForbiddenWord['category']) => void;
  removeForbiddenWord: (groupId: string, wordId: string) => void;
  logs: ModerationLog[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const adminData = useAdminData();

  return (
    <AdminContext.Provider value={adminData}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
