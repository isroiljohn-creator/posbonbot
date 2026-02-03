import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslations } from '@/i18n';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ScrollText,
  CreditCard,
  HelpCircle,
  Bot,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();
  const t = useTranslations();
  const { slotOverview } = useAdmin();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t.nav.dashboard },
    { path: '/groups', icon: Users, label: t.nav.groups },
    { path: '/logs', icon: ScrollText, label: t.nav.logs },
    { path: '/subscription', icon: CreditCard, label: t.nav.subscription },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden',
          'animate-slide-in-right'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">ModerBot</span>
              <span className="text-xs text-muted-foreground">{t.nav.adminPanel}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Slot indicator */}
        <div className="mx-4 mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.subscription.slots}</span>
            <span className="font-semibold text-foreground">
              {slotOverview.used}/{slotOverview.total}
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(slotOverview.used / slotOverview.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={onClose}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 px-4 py-3 h-auto font-medium transition-all text-base',
                    isActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/15'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Help */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <Link to="/help" onClick={onClose}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <HelpCircle className="w-5 h-5" />
              <span>{t.nav.help}</span>
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
