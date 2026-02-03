import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="uppercase font-medium">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('uz')}
          className={language === 'uz' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇺🇿</span>
          O'zbekcha
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('ru')}
          className={language === 'ru' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇷🇺</span>
          Русский
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
