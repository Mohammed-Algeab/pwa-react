// contexts/SettingsContext.tsx
// ponytail: في team-apk، useSettings() كان useState محلي بكل استدعاء (يعمل
// لأن RN غالباً يستدعيه من شاشة جذر واحدة). هنا حوّلناه لـContext فعلي: تبديل
// الثيم من شاشة الإعدادات يجب ينعكس فوراً بالـSidebar وكل الصفحات في آن واحد
// (especially مهم بالتخطيط المتجاوب الجديد)، وContext هو الطريقة الصحيحة
// لمشاركة حالة متزامنة بين مكوّنات لا قرابة مباشرة بينها.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const FONT_SCALE_KEY = 'font_scale';
const THEME_KEY = 'app_theme';
const NOTIFICATIONS_KEY = 'notifications_enabled';

export type AppTheme = 'dark' | 'light' | 'system';

interface SettingsContextValue {
  fontScale: number;
  theme: AppTheme;
  notificationsEnabled: boolean;
  loaded: boolean;
  setFontScale: (scale: number) => void;
  setTheme: (theme: AppTheme) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScaleState] = useState(1);
  const [theme, setThemeState] = useState<AppTheme>('system');
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // تحميل القيم المحفوظة من localStorage مرة واحدة عند بدء التطبيق
  useEffect(() => {
    const fs = localStorage.getItem(FONT_SCALE_KEY);
    const th = localStorage.getItem(THEME_KEY);
    const ne = localStorage.getItem(NOTIFICATIONS_KEY);
    if (fs) setFontScaleState(parseFloat(fs));
    if (th === 'dark' || th === 'light' || th === 'system') setThemeState(th);
    if (ne !== null) setNotificationsEnabledState(ne === 'true');
    setLoaded(true);
  }, []);

  // تطبيق الثيم الفعلي على <html> — هذا ما تقرأه index.css (:root.light)
  useEffect(() => {
    if (!loaded) return;
    const effectiveDark = theme === 'system' ? getSystemPrefersDark() : theme === 'dark';
    document.documentElement.classList.toggle('light', !effectiveDark);
  }, [theme, loaded]);

  // متابعة تغيّر تفضيل النظام لحظياً إن كان theme === 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      document.documentElement.classList.toggle('light', !mq.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setFontScale = (scale: number) => {
    setFontScaleState(scale);
    localStorage.setItem(FONT_SCALE_KEY, scale.toString());
  };

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem(NOTIFICATIONS_KEY, enabled.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        fontScale,
        theme,
        notificationsEnabled,
        loaded,
        setFontScale,
        setTheme,
        setNotificationsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}

/** يرجع 'dark' | 'light' الفعلي بعد حل قيمة 'system' — مفيد للمكوّنات
 * التي تحتاج قراراً نهائياً (مثل اختيار ثيم giscus). */
export function useEffectiveTheme(): 'dark' | 'light' {
  const { theme } = useSettings();
  if (theme !== 'system') return theme;
  return getSystemPrefersDark() ? 'dark' : 'light';
}
