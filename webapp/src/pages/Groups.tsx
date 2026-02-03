import { useState } from 'react';
import { useTranslations } from '@/i18n';
import { useAdmin } from '@/contexts/AdminContext';
import { MainLayout } from '@/components/MainLayout';
import { GroupCard } from '@/components/GroupCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Crown, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Groups() {
  const t = useTranslations();
  const { boundGroups, unboundGroups, slotOverview, bindGroup, unbindGroup } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'bind' | 'unbind';
    groupId: string;
    groupName: string;
  }>({ open: false, type: 'bind', groupId: '', groupName: '' });

  const filterGroups = (groups: typeof boundGroups) => {
    if (!searchQuery) return groups;
    return groups.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleBind = (groupId: string, groupName: string) => {
    if (slotOverview.free === 0) {
      toast.error(t.messages.noSlotsAvailable);
      return;
    }
    setConfirmDialog({ open: true, type: 'bind', groupId, groupName });
  };

  const handleUnbind = (groupId: string, groupName: string) => {
    setConfirmDialog({ open: true, type: 'unbind', groupId, groupName });
  };

  const confirmAction = () => {
    if (confirmDialog.type === 'bind') {
      bindGroup(confirmDialog.groupId);
      toast.success(t.messages.bindSuccess);
    } else {
      unbindGroup(confirmDialog.groupId);
      toast.success(t.messages.unbindSuccess);
    }
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  return (
    <MainLayout title={t.groups.title}>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">{t.groups.description}</p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.common.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* Slot status bar */}
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <span className="text-muted-foreground">{t.subscription.slots}</span>
              <span className="font-semibold">
                {slotOverview.used} / {slotOverview.total}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(slotOverview.used / slotOverview.total) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl sm:text-2xl font-bold text-success">{slotOverview.free}</p>
            <p className="text-xs text-muted-foreground">{t.dashboard.freeSlots}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bound" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-muted/50 w-full h-auto p-1 grid grid-cols-2">
            <TabsTrigger value="bound" className="gap-1.5 sm:gap-2 py-2.5 text-xs sm:text-sm">
              <Crown className="w-4 h-4" />
              <span className="hidden xs:inline">{t.groups.boundGroups}</span>
              <span className="xs:hidden">Premium</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                {boundGroups.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="unbound" className="gap-1.5 sm:gap-2 py-2.5 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden xs:inline">{t.groups.unboundGroups}</span>
              <span className="xs:hidden">Free</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {unboundGroups.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bound" className="space-y-4">
            {filterGroups(boundGroups).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filterGroups(boundGroups).map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onUnbind={() => handleUnbind(group.id, group.title)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 sm:py-12 text-sm sm:text-base text-muted-foreground">
                {searchQuery ? t.groups.noGroups : t.groups.noGroups}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unbound" className="space-y-4">
            {filterGroups(unboundGroups).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filterGroups(unboundGroups).map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onBind={() => handleBind(group.id, group.title)}
                    canBind={slotOverview.free > 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 sm:py-12 text-sm sm:text-base text-muted-foreground">
                {t.groups.noGroups}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              {confirmDialog.type === 'bind' ? t.groups.bind : t.groups.unbind}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {confirmDialog.type === 'bind' 
                ? t.groups.bindConfirm 
                : t.groups.unbindConfirm}
              <br />
              <span className="font-medium text-foreground mt-2 block">
                {confirmDialog.groupName}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} className="w-full sm:w-auto">
              {t.common.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
