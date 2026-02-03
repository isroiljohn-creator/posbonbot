import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'premium' | 'success' | 'warning';
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-primary/5 border-primary/20',
    premium: 'bg-premium/5 border-premium/20',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    premium: 'bg-premium/10 text-premium',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className={cn(
      'rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:shadow-lg active:scale-[0.98]',
      variantStyles[variant],
      className
    )}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">{title}</p>
          <div className={cn('p-2 rounded-lg shrink-0', iconStyles[variant])}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {trend && (
          <p className={cn(
            'text-xs font-medium',
            trend.isPositive ? 'text-success' : 'text-destructive'
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </p>
        )}
      </div>
    </div>
  );
}
