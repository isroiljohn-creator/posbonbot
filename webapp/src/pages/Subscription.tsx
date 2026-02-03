import { useTranslations } from '@/i18n';
import { useAdmin } from '@/contexts/AdminContext';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Check, 
  Zap, 
  Building2, 
  CreditCard,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SubscriptionPlan } from '@/types';

export default function Subscription() {
  const t = useTranslations();
  const { subscription, slotOverview } = useAdmin();

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: t.subscription.basic,
      price: 9.99,
      slots: 3,
      features: [
        `3 ${t.subscription.groupSlots}`,
        t.subscription.basicModeration,
        t.subscription.captchaVerification,
        t.subscription.emailSupport,
      ],
    },
    {
      id: 'pro',
      name: t.subscription.pro,
      price: 24.99,
      slots: 10,
      features: [
        `10 ${t.subscription.groupSlots}`,
        t.subscription.advancedAntiSpam,
        t.subscription.customForbiddenWords,
        t.subscription.prioritySupport,
        t.subscription.analyticsDashboard,
      ],
    },
    {
      id: 'enterprise',
      name: t.subscription.enterprise,
      price: 99.99,
      slots: 50,
      features: [
        `50 ${t.subscription.groupSlots}`,
        t.subscription.unlimitedForbiddenWords,
        t.subscription.customCaptchaBranding,
        t.subscription.apiAccess,
        t.subscription.dedicatedSupport,
        t.subscription.customIntegrations,
      ],
    },
  ];

  const currentPlan = plans.find(p => p.id === subscription.plan);
  const daysUntilExpiry = Math.ceil(
    (new Date(subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <MainLayout title={t.subscription.title}>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Current subscription */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-premium" />
                  {t.subscription.currentPlan}
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {t.subscription.renewsOn}: {format(new Date(subscription.expiresAt), 'MMM d, yyyy')}
                </p>
              </div>
              <Badge className="bg-premium/20 text-premium border-premium/30 text-base sm:text-lg px-3 sm:px-4 py-1 w-fit">
                {currentPlan?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Slot usage */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.subscription.slots}</span>
                <span className="font-semibold">
                  {slotOverview.used} / {slotOverview.total}
                </span>
              </div>
              <Progress 
                value={(slotOverview.used / slotOverview.total) * 100} 
                className="h-2.5 sm:h-3"
              />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">{t.dashboard.totalSlots}</p>
                <p className="text-xl sm:text-2xl font-bold">{slotOverview.total}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">{t.dashboard.usedSlots}</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{slotOverview.used}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">{t.dashboard.freeSlots}</p>
                <p className="text-xl sm:text-2xl font-bold text-success">{slotOverview.free}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">{t.subscription.expiresOn}</p>
                <p className="text-xl sm:text-2xl font-bold">{daysUntilExpiry}d</p>
              </div>
            </div>

            {/* Add slots button */}
            <Button variant="outline" className="w-full gap-2 h-10 sm:h-11">
              <Plus className="w-4 h-4" />
              {t.subscription.addSlots}
            </Button>
          </CardContent>
        </Card>

        {/* Available plans */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">{t.subscription.plans}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.id === subscription.plan;
              const Icon = plan.id === 'basic' ? Zap : plan.id === 'pro' ? Crown : Building2;
              
              return (
                <Card 
                  key={plan.id}
                  className={cn(
                    'relative transition-all duration-200',
                    isCurrent 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'hover:border-primary/50 active:scale-[0.98]'
                  )}
                >
                  {isCurrent && (
                    <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {t.subscription.current}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-2 px-4 sm:px-6 pt-5 sm:pt-6">
                    <div className={cn(
                      'w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl flex items-center justify-center',
                      plan.id === 'basic' && 'bg-info/10',
                      plan.id === 'pro' && 'bg-premium/10',
                      plan.id === 'enterprise' && 'bg-primary/10',
                    )}>
                      <Icon className={cn(
                        'w-6 h-6 sm:w-7 sm:h-7',
                        plan.id === 'basic' && 'text-info',
                        plan.id === 'pro' && 'text-premium',
                        plan.id === 'enterprise' && 'text-primary',
                      )} />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl sm:text-4xl font-bold">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">{t.subscription.perMonth}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                          <Check className="w-4 h-4 text-success shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant={isCurrent ? 'outline' : 'default'}
                      className="w-full gap-2 h-10 sm:h-11"
                      disabled={isCurrent}
                    >
                      {isCurrent ? (
                        t.subscription.currentPlan
                      ) : (
                        <>
                          {t.subscription.selectPlan}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Payment method */}
        <Card>
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.subscription.paymentMethod}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 border border-border gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-7 sm:w-12 sm:h-8 bg-gradient-to-r from-info to-primary rounded flex items-center justify-center text-info-foreground text-xs font-bold shrink-0">
                  VISA
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base">•••• 4242</p>
                  <p className="text-xs text-muted-foreground">12/26</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">{t.common.edit}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
