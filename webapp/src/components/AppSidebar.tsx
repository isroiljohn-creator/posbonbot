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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export function AppSidebar({ className }: SidebarProps) {
  const location = useLocation();
  const t = useTranslations();
  const { slotOverview } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t.nav.dashboard },
    { path: '/groups', icon: Users, label: t.nav.groups },
    { path: '/logs', icon: ScrollText, label: t.nav.logs },
    { path: '/subscription', icon: CreditCard, label: t.nav.subscription },
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
          <Bot className="w-6 h-6" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">ModerBot</span>
            <span className="text-xs text-muted-foreground">{t.nav.adminPanel}</span>
          </div>
        )}
      </div>

      {/* Slot indicator */}
      {!collapsed && (
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
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 px-3 py-2.5 h-auto font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', collapsed && 'mx-auto')} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-2 py-4 border-t border-sidebar-border space-y-1">
        <Link to="/help">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <HelpCircle className={cn('w-5 h-5 shrink-0', collapsed && 'mx-auto')} />
            {!collapsed && <span>{t.nav.help}</span>}
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-10 text-muted-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
