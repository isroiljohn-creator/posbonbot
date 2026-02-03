import { useTranslations } from '@/i18n';
import { useAdmin } from '@/contexts/AdminContext';
import { MainLayout } from '@/components/MainLayout';
import { StatCard } from '@/components/StatCard';
import { GroupCard } from '@/components/GroupCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Layers, 
  CheckCircle2, 
  Circle, 
  Crown, 
  Users, 
  Plus,
  ArrowRight,
  ScrollText,
  Link2,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { 
    user, 
    slotOverview, 
    boundGroups, 
    logs,
    unbindGroup,
  } = useAdmin();

  const recentLogs = logs.slice(0, 5);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'delete': return 'text-warning';
      case 'warn': return 'text-warning';
      case 'mute': return 'text-info';
      case 'kick': return 'text-destructive';
      case 'ban': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <MainLayout title={t.dashboard.title}>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Welcome message */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t.dashboard.welcome}, {user.firstName}! 👋
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {t.dashboard.overview}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/groups')}
            className="gap-2 w-full sm:w-auto"
            size="lg"
          >
            <Link2 className="w-4 h-4" />
            {t.dashboard.bindGroup}
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title={t.dashboard.totalSlots}
            value={slotOverview.total}
            icon={Layers}
            variant="default"
          />
          <StatCard
            title={t.dashboard.usedSlots}
            value={slotOverview.used}
            icon={CheckCircle2}
            variant="primary"
          />
          <StatCard
            title={t.dashboard.freeSlots}
            value={slotOverview.free}
            icon={Circle}
            variant={slotOverview.free > 0 ? 'success' : 'warning'}
          />
          <StatCard
            title={t.dashboard.premiumGroups}
            value={boundGroups.length}
            icon={Crown}
            variant="premium"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Bound groups */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-premium" />
                {t.groups.boundGroups}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/groups')} className="gap-1 text-xs sm:text-sm">
                {t.common.all}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            {boundGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {boundGroups.slice(0, 4).map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onUnbind={() => unbindGroup(group.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
                  <div className="p-3 sm:p-4 rounded-full bg-muted mb-3 sm:mb-4">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{t.groups.noGroups}</p>
                  <Button onClick={() => navigate('/groups')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t.dashboard.bindGroup}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent activity */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                <ScrollText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {t.dashboard.recentActivity}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6">
              {recentLogs.length > 0 ? (
                <>
                  {recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="p-1 sm:p-1.5 rounded-md bg-background shrink-0">
                        <Shield className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${getActionColor(log.action)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {log.username ? `@${log.username}` : `User ${log.userId}`}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {log.action} • {log.reason.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5 sm:mt-1">
                          {format(new Date(log.createdAt), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-xs sm:text-sm" 
                    onClick={() => navigate('/logs')}
                  >
                    {t.dashboard.viewLogs}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-6 sm:py-8">
                  {t.logs.noLogs}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick upgrade section */}
        {slotOverview.free === 0 && (
          <Card className="border-premium/30 bg-gradient-to-r from-premium/5 to-transparent">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:py-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-xl bg-premium/10 shrink-0">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-premium" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">{t.groups.noFreeSlots}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.messages.noSlotsAvailable}</p>
                </div>
              </div>
              <Button onClick={() => navigate('/subscription')} className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                {t.dashboard.upgradeSlots}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
