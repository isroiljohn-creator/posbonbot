import { Group } from '@/types';
import { useTranslations } from '@/i18n';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, Unlink, Users, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  group: Group;
  onBind?: () => void;
  onUnbind?: () => void;
  canBind?: boolean;
}

export function GroupCard({ group, onBind, onUnbind, canBind = true }: GroupCardProps) {
  const t = useTranslations();
  const navigate = useNavigate();

  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card p-4 sm:p-5 transition-all duration-200',
        'hover:border-primary/30 hover:shadow-lg',
        'active:scale-[0.98]',
        group.isPremium && 'border-premium/30 bg-gradient-to-br from-premium/5 to-transparent'
      )}
    >
      {/* Premium badge */}
      {group.isPremium && (
        <div className="absolute -top-2 -right-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-premium text-premium-foreground text-xs font-medium shadow-lg">
            <Crown className="w-3 h-3" />
            <span className="hidden sm:inline">Premium</span>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {/* Group info */}
        <div className="space-y-1 pr-8">
          <h3 className="font-semibold text-foreground text-base sm:text-lg leading-tight line-clamp-2">
            {group.title}
          </h3>
          {group.username && (
            <p className="text-sm text-muted-foreground">@{group.username}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{formatMembers(group.memberCount)}</span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'font-medium text-xs',
              group.isPremium
                ? 'border-premium/50 text-premium bg-premium/10'
                : 'border-muted-foreground/30 text-muted-foreground'
            )}
          >
            {group.isPremium ? t.groups.statusPremium : t.groups.statusFree}
          </Badge>
        </div>

        {/* Ads status */}
        <p className={cn(
          'text-xs font-medium',
          group.adsExempt ? 'text-success' : 'text-warning'
        )}>
          {group.adsExempt ? t.groups.adsDisabled : t.groups.adsEnabled}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 sm:pt-2">
          {/* All groups can access settings */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/groups/${group.id}/settings`)}
            className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
          >
            {t.groups.configure}
          </Button>
          {group.isPremium && onUnbind ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onUnbind}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 sm:h-10 w-9 sm:w-10 p-0"
            >
              <Unlink className="w-4 h-4" />
            </Button>
          ) : null}
          {!group.isPremium && onBind && canBind ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBind}
              className="text-premium hover:text-premium hover:bg-premium/10 h-9 sm:h-10 w-9 sm:w-10 p-0"
              title="Premiumga aylantirish"
            >
              <Crown className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
