import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslations } from '@/i18n';
import { useAdmin } from '@/contexts/AdminContext';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Shield,
  Ban,
  Zap,
  UserCheck,
  Bot,
  Save,
  Plus,
  X,
  Download,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { GroupSettings as GroupSettingsType, ForbiddenWord } from '@/types';
import { Language } from '@/i18n';
import { cn } from '@/lib/utils';

export default function GroupSettings() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const t = useTranslations();
  const { groups, getGroupSettings, updateGroupSettings, getGroupForbiddenWords, addForbiddenWord, removeForbiddenWord } = useAdmin();

  const group = groups.find(g => g.id === groupId);
  const existingSettings = getGroupSettings(groupId || '');
  const forbiddenWords = getGroupForbiddenWords(groupId || '');

  const [settings, setSettings] = useState<Partial<GroupSettingsType>>(
    existingSettings || {
      deleteLinks: false,
      deleteMentions: false,
      deleteForwarded: false,
      allowPhotos: true,
      allowVideos: true,
      allowStickers: true,
      allowGifs: true,
      floodControlEnabled: false,
      floodMessagesLimit: 5,
      floodIntervalSeconds: 10,
      duplicateDetection: false,
      warnSystemEnabled: false,
      warnLimit: 3,
      actionOnLimit: 'mute',
      captchaEnabled: false,
      captchaType: 'button',
      captchaTimeoutSeconds: 60,
      captchaFailAction: 'kick',
      newUserReadOnly: false,
      readOnlyDurationSeconds: 300,
      silentMode: false,
      botLanguage: 'uz',
    }
  );

  const [newWord, setNewWord] = useState('');
  const [newWordCategory, setNewWordCategory] = useState<ForbiddenWord['category']>('custom');

  if (!group || !groupId) {
    return (
      <MainLayout title={t.settings.title}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">{t.settings.groupNotFound}</p>
          <Button variant="ghost" onClick={() => navigate('/groups')} className="mt-4">
            {t.common.back}
          </Button>
        </div>
      </MainLayout>
    );
  }

  const updateSetting = <K extends keyof GroupSettingsType>(key: K, value: GroupSettingsType[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateGroupSettings(groupId, settings);
    toast.success(t.messages.settingsSaved);
  };

  const handleAddWord = () => {
    if (newWord.trim()) {
      addForbiddenWord(groupId, newWord.trim(), newWordCategory);
      setNewWord('');
      toast.success(t.messages.wordAdded);
    }
  };

  const handleRemoveWord = (wordId: string) => {
    removeForbiddenWord(groupId, wordId);
    toast.success(t.messages.wordRemoved);
  };

  const SettingRow = ({ 
    label, 
    description, 
    children 
  }: { 
    label: string; 
    description?: string; 
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-3 px-1 border-b border-border/50 last:border-0 gap-4">
      <div className="space-y-0.5 min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );

  const categoryColors: Record<ForbiddenWord['category'], string> = {
    swear: 'bg-destructive/20 text-destructive border-destructive/30',
    scam: 'bg-warning/20 text-warning border-warning/30',
    crypto: 'bg-info/20 text-info border-info/30',
    custom: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <MainLayout title={group.title}>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/groups')} className="gap-1.5 sm:gap-2 px-2 sm:px-3">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.common.back}</span>
          </Button>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="moderation" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-muted/50 h-auto p-1 w-full grid grid-cols-5 gap-1">
            <TabsTrigger value="moderation" className="py-2.5 px-2 text-[11px] sm:text-xs font-medium">
              <Shield className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">{t.settings.moderation}</span>
            </TabsTrigger>
            <TabsTrigger value="words" className="py-2.5 px-2 text-[11px] sm:text-xs font-medium">
              <Ban className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">{t.settings.forbiddenWords}</span>
            </TabsTrigger>
            <TabsTrigger value="antispam" className="py-2.5 px-2 text-[11px] sm:text-xs font-medium">
              <Zap className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">{t.settings.antiSpam}</span>
            </TabsTrigger>
            <TabsTrigger value="captcha" className="py-2.5 px-2 text-[11px] sm:text-xs font-medium">
              <UserCheck className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">{t.settings.captcha}</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="py-2.5 px-2 text-[11px] sm:text-xs font-medium">
              <Bot className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">{t.settings.botBehavior}</span>
            </TabsTrigger>
          </TabsList>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  {t.settings.moderation}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t.settings.moderationDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 px-4 sm:px-6">
                <SettingRow label={t.settings.deleteLinks}>
                  <Switch
                    checked={settings.deleteLinks}
                    onCheckedChange={(v) => updateSetting('deleteLinks', v)}
                  />
                </SettingRow>
                <SettingRow label={t.settings.deleteMentions}>
                  <Switch
                    checked={settings.deleteMentions}
                    onCheckedChange={(v) => updateSetting('deleteMentions', v)}
                  />
                </SettingRow>
                <SettingRow label={t.settings.deleteForwarded}>
                  <Switch
                    checked={settings.deleteForwarded}
                    onCheckedChange={(v) => updateSetting('deleteForwarded', v)}
                  />
                </SettingRow>

                <div className="pt-4 mt-4 border-t border-border">
                  <Label className="text-sm font-medium mb-3 sm:mb-4 block">{t.settings.mediaLimits}</Label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[
                      { key: 'allowPhotos' as const, label: t.settings.photos },
                      { key: 'allowVideos' as const, label: t.settings.videos },
                      { key: 'allowStickers' as const, label: t.settings.stickers },
                      { key: 'allowGifs' as const, label: t.settings.gifs },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={cn(
                          'flex items-center justify-between p-2.5 sm:p-3 rounded-lg border transition-colors cursor-pointer',
                          settings[key] 
                            ? 'bg-success/10 border-success/30' 
                            : 'bg-destructive/10 border-destructive/30'
                        )}
                        onClick={() => updateSetting(key, !settings[key])}
                      >
                        <span className="text-xs sm:text-sm font-medium">{label}</span>
                        <Switch checked={settings[key]} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forbidden Words Tab */}
          <TabsContent value="words">
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Ban className="w-5 h-5 text-primary" />
                  {t.settings.forbiddenWords}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t.settings.forbiddenWordsDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                {/* Add new word */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder={t.settings.addWord}
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                    className="flex-1 h-10"
                  />
                  <div className="flex gap-2">
                    <Select value={newWordCategory} onValueChange={(v) => setNewWordCategory(v as ForbiddenWord['category'])}>
                      <SelectTrigger className="w-full sm:w-32 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="swear">{t.settings.swear}</SelectItem>
                        <SelectItem value="scam">{t.settings.scam}</SelectItem>
                        <SelectItem value="crypto">{t.settings.crypto}</SelectItem>
                        <SelectItem value="custom">{t.settings.custom}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddWord} size="icon" className="h-10 w-10 shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Import/Export */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none text-xs sm:text-sm">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.settings.importWords}</span>
                    <span className="sm:hidden">{t.common.import}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none text-xs sm:text-sm">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.settings.exportWords}</span>
                    <span className="sm:hidden">{t.common.export}</span>
                  </Button>
                </div>

                {/* Word list */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t.settings.wordList}</Label>
                  {forbiddenWords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {forbiddenWords.map((word) => (
                        <Badge
                          key={word.id}
                          variant="outline"
                          className={cn('gap-1.5 pr-1 text-xs sm:text-sm', categoryColors[word.category])}
                        >
                          {word.word}
                          <button
                            onClick={() => handleRemoveWord(word.id)}
                            className="ml-1 hover:bg-background/50 rounded p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                      {t.settings.noForbiddenWords}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anti-Spam Tab */}
          <TabsContent value="antispam">
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  {t.settings.antiSpam}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t.settings.antiSpamDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 px-4 sm:px-6">
                <SettingRow label={t.settings.floodControl}>
                  <Switch
                    checked={settings.floodControlEnabled}
                    onCheckedChange={(v) => updateSetting('floodControlEnabled', v)}
                  />
                </SettingRow>

                {settings.floodControlEnabled && (
                  <div className="py-4 px-1 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <Label>{t.settings.messagesPerInterval}</Label>
                        <span className="font-medium">{settings.floodMessagesLimit}</span>
                      </div>
                      <Slider
                        value={[settings.floodMessagesLimit || 5]}
                        onValueChange={([v]) => updateSetting('floodMessagesLimit', v)}
                        min={2}
                        max={20}
                        step={1}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <Label>{t.settings.intervalSeconds}</Label>
                        <span className="font-medium">{settings.floodIntervalSeconds}s</span>
                      </div>
                      <Slider
                        value={[settings.floodIntervalSeconds || 10]}
                        onValueChange={([v]) => updateSetting('floodIntervalSeconds', v)}
                        min={5}
                        max={60}
                        step={5}
                      />
                    </div>
                  </div>
                )}

                <SettingRow label={t.settings.duplicateDetection}>
                  <Switch
                    checked={settings.duplicateDetection}
                    onCheckedChange={(v) => updateSetting('duplicateDetection', v)}
                  />
                </SettingRow>

                <SettingRow label={t.settings.warnSystem}>
                  <Switch
                    checked={settings.warnSystemEnabled}
                    onCheckedChange={(v) => updateSetting('warnSystemEnabled', v)}
                  />
                </SettingRow>

                {settings.warnSystemEnabled && (
                  <div className="py-4 px-1 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <Label>{t.settings.warnLimit}</Label>
                        <span className="font-medium">{settings.warnLimit}</span>
                      </div>
                      <Slider
                        value={[settings.warnLimit || 3]}
                        onValueChange={([v]) => updateSetting('warnLimit', v)}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">{t.settings.actionOnLimit}</Label>
                      <Select 
                        value={settings.actionOnLimit} 
                        onValueChange={(v) => updateSetting('actionOnLimit', v as 'mute' | 'kick')}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mute">{t.settings.mute}</SelectItem>
                          <SelectItem value="kick">{t.settings.kick}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Captcha Tab */}
          <TabsContent value="captcha">
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                  {t.settings.captcha}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t.settings.captchaDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 px-4 sm:px-6">
                <SettingRow label={t.settings.enableCaptcha}>
                  <Switch
                    checked={settings.captchaEnabled}
                    onCheckedChange={(v) => updateSetting('captchaEnabled', v)}
                  />
                </SettingRow>

                {settings.captchaEnabled && (
                  <div className="py-4 px-1 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">{t.settings.captchaType}</Label>
                      <Select 
                        value={settings.captchaType} 
                        onValueChange={(v) => updateSetting('captchaType', v as 'button' | 'math')}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="button">{t.settings.buttonCaptcha}</SelectItem>
                          <SelectItem value="math">{t.settings.mathCaptcha}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <Label>{t.settings.timeoutSeconds}</Label>
                        <span className="font-medium">{settings.captchaTimeoutSeconds}s</span>
                      </div>
                      <Slider
                        value={[settings.captchaTimeoutSeconds || 60]}
                        onValueChange={([v]) => updateSetting('captchaTimeoutSeconds', v)}
                        min={30}
                        max={300}
                        step={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">{t.settings.failAction}</Label>
                      <Select 
                        value={settings.captchaFailAction} 
                        onValueChange={(v) => updateSetting('captchaFailAction', v as 'kick' | 'mute')}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kick">{t.settings.kick}</SelectItem>
                          <SelectItem value="mute">{t.settings.mute}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <SettingRow label={t.settings.newUserReadOnly}>
                  <Switch
                    checked={settings.newUserReadOnly}
                    onCheckedChange={(v) => updateSetting('newUserReadOnly', v)}
                  />
                </SettingRow>

                {settings.newUserReadOnly && (
                  <div className="py-4 px-1 space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <Label>{t.settings.readOnlyDuration}</Label>
                      <span className="font-medium">{(settings.readOnlyDurationSeconds || 300) / 60} min</span>
                    </div>
                    <Slider
                      value={[settings.readOnlyDurationSeconds || 300]}
                      onValueChange={([v]) => updateSetting('readOnlyDurationSeconds', v)}
                      min={60}
                      max={1800}
                      step={60}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bot Behavior Tab */}
          <TabsContent value="behavior">
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Bot className="w-5 h-5 text-primary" />
                  {t.settings.botBehavior}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t.settings.botBehaviorDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 px-4 sm:px-6">
                <SettingRow 
                  label={t.settings.silentMode}
                  description={t.settings.silentModeDesc}
                >
                  <Switch
                    checked={settings.silentMode}
                    onCheckedChange={(v) => updateSetting('silentMode', v)}
                  />
                </SettingRow>

                <div className="py-4 px-1 space-y-2">
                  <Label className="text-xs sm:text-sm">{t.settings.botLanguage}</Label>
                  <Select 
                    value={settings.botLanguage} 
                    onValueChange={(v) => updateSetting('botLanguage', v as Language)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uz">🇺🇿 O'zbekcha</SelectItem>
                      <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed at bottom */}
        <div className="sticky bottom-0 left-0 right-0 p-4 -mx-4 sm:-mx-6 bg-background/95 backdrop-blur-sm border-t border-border">
          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="w-4 h-4" />
            {t.common.save}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
