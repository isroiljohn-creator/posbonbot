import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MobileSidebar } from '@/components/MobileSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Menu, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-background/80 backdrop-blur-lg border-b border-border">
        {/* Left side - Mobile menu + title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden shrink-0"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <Bot className="w-5 h-5" />
            </div>
          </div>

          {title && (
            <h1 className="hidden sm:block text-lg sm:text-xl font-semibold text-foreground truncate">
              {title}
            </h1>
          )}
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-border">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                {user.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                @{user.username}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}
