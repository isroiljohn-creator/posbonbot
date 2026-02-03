import { useState } from 'react';
import { useTranslations } from '@/i18n';
import { useAdmin } from '@/contexts/AdminContext';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollText, Filter, Link, MessageSquare, Ban, UserX, AlertTriangle, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ModerationLog } from '@/types';

export default function Logs() {
  const t = useTranslations();
  const { logs, groups } = useAdmin();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedReason, setSelectedReason] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    if (selectedGroup !== 'all' && log.groupId !== selectedGroup) return false;
    if (selectedReason !== 'all' && log.reason !== selectedReason) return false;
    return true;
  });

  const getReasonIcon = (reason: ModerationLog['reason']) => {
    switch (reason) {
      case 'link': return Link;
      case 'spam': return MessageSquare;
      case 'forbidden_word': return Ban;
      case 'captcha_fail': return UserX;
      case 'flood': return AlertTriangle;
      case 'duplicate': return MessageSquare;
      default: return Shield;
    }
  };

  const getReasonLabel = (reason: ModerationLog['reason']) => {
    switch (reason) {
      case 'link': return t.logs.link;
      case 'spam': return t.logs.spam;
      case 'forbidden_word': return t.logs.forbiddenWord;
      case 'captcha_fail': return t.logs.captchaFail;
      case 'flood': return 'Flood';
      case 'duplicate': return 'Duplicate';
      default: return reason;
    }
  };

  const getActionColor = (action: ModerationLog['action']) => {
    switch (action) {
      case 'delete': return 'bg-warning/20 text-warning border-warning/30';
      case 'warn': return 'bg-warning/20 text-warning border-warning/30';
      case 'mute': return 'bg-info/20 text-info border-info/30';
      case 'kick': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'ban': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getGroupName = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group?.title || t.nav.unknownGroup;
  };

  // Calculate stats
  const captchaLogs = logs.filter(l => l.reason === 'captcha_fail');
  const captchaFailRate = logs.length > 0 
    ? ((captchaLogs.length / logs.length) * 100).toFixed(1) 
    : '0';

  const userCounts = logs.reduce((acc, log) => {
    const key = log.username || `user_${log.userId}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topOffenders = Object.entries(userCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <MainLayout title={t.logs.title}>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground">{t.logs.description}</p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{t.logs.recentLogs}</p>
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <ScrollText className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{logs.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{t.logs.captchaFailRate}</p>
                  <div className="p-2 rounded-lg bg-warning/10 shrink-0">
                    <UserX className="w-4 h-4 text-warning" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{captchaFailRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-1">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {t.logs.topOffenders}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-1">
                {topOffenders.slice(0, 3).map(([user, count], i) => (
                  <div key={user} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-foreground truncate">
                      {i + 1}. {user.startsWith('user_') ? `User ${user.split('_')[1]}` : `@${user}`}
                    </span>
                    <Badge variant="outline" className="ml-2 text-xs">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex flex-col gap-3">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                {t.logs.filterByReason}
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-full sm:w-48 h-10">
                    <SelectValue placeholder={t.nav.allGroups} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.nav.allGroups}</SelectItem>
                    {groups.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="w-full sm:w-40 h-10">
                    <SelectValue placeholder="All reasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.common.all}</SelectItem>
                    <SelectItem value="link">{t.logs.link}</SelectItem>
                    <SelectItem value="spam">{t.logs.spam}</SelectItem>
                    <SelectItem value="forbidden_word">{t.logs.forbiddenWord}</SelectItem>
                    <SelectItem value="captcha_fail">{t.logs.captchaFail}</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="duplicate">Duplicate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {filteredLogs.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {filteredLogs.map((log) => {
                  const ReasonIcon = getReasonIcon(log.reason);
                  return (
                    <div 
                      key={log.id} 
                      className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="p-1.5 sm:p-2 rounded-lg bg-background shrink-0">
                        <ReasonIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {log.username ? `@${log.username}` : `User ${log.userId}`}
                          </p>
                          <Badge variant="outline" className={cn('shrink-0 text-xs', getActionColor(log.action))}>
                            {log.action}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                          <span>{getReasonLabel(log.reason)}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline truncate">{getGroupName(log.groupId)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground/60">
                          {format(new Date(log.createdAt), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 sm:py-12 text-sm sm:text-base text-muted-foreground">
                {t.logs.noLogs}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
