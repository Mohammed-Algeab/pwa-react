// pages/SettingsPage.tsx
import { Link } from 'react-router-dom';
import { Moon, Sun, Monitor, CheckCircle, Circle, Bell, Heart, ChevronLeft } from 'lucide-react';
import { useSettings, type AppTheme } from '@/contexts/SettingsContext';

const THEME_OPTIONS: { value: AppTheme; label: string; icon: typeof Moon }[] = [
  { value: 'dark', label: 'داكن', icon: Moon },
  { value: 'light', label: 'فاتح', icon: Sun },
  { value: 'system', label: 'تلقائي', icon: Monitor },
];

const SCALE_STEPS = [0.8, 1.0, 1.2, 1.4];

export function SettingsPage() {
  const {
    fontScale,
    theme,
    notificationsEnabled,
    setFontScale,
    setTheme,
    setNotificationsEnabled,
    loaded,
  } = useSettings();

  if (!loaded) return null;

  const fillPercent = ((fontScale - 0.8) / 0.6) * 100;

  return (
    <div className="max-w-xl mx-auto pt-5 md:pt-10 pb-10 px-4">
      <div className="px-1 pb-4 mb-4 border-b border-border">
        <h1 className="text-xl font-extrabold text-text text-right font-[family-name:var(--font-cairo)]">
          الإعدادات
        </h1>
      </div>

      {/* Theme */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-bronze text-right mb-2.5">المظهر</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
          {THEME_OPTIONS.map((opt) => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className="w-full flex flex-row-reverse items-center gap-3 px-3 py-3"
              >
                <opt.icon size={16} className="text-muted-foreground" />
                <span className="flex-1 text-sm font-medium text-text text-right">{opt.label}</span>
                {active ? (
                  <CheckCircle size={20} className="text-bronze" />
                ) : (
                  <Circle size={20} className="text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Font scale */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-bronze text-right mb-2.5">حجم الخط</h2>
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="flex flex-row-reverse items-center gap-3 py-2">
            <span className="text-xs text-muted-foreground w-10 text-center">صغير</span>
            <div className="flex-1 h-1 rounded-full bg-bronze/[0.15] relative flex flex-row-reverse items-center justify-between">
              <div className="absolute right-0 top-0 bottom-0 rounded-full bg-bronze" style={{ width: `${fillPercent}%` }} />
              {SCALE_STEPS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFontScale(v)}
                  aria-label={`حجم الخط ${Math.round(v * 100)}%`}
                  className="w-4 h-4 rounded-full relative z-[1]"
                  style={{ backgroundColor: fontScale >= v ? 'var(--color-bronze)' : 'var(--color-border)' }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground w-10 text-center">كبير</span>
          </div>
          <p className="text-center text-base font-semibold text-text mt-2">{Math.round(fontScale * 100)}%</p>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-bronze text-right mb-2.5">الإشعارات</h2>
        <div className="rounded-xl border border-border bg-card p-3 flex flex-row-reverse items-center gap-3">
          <Bell size={20} className="text-bronze" />
          <span className="flex-1 text-sm font-medium text-text text-right">إشعارات التحميلات الجديدة</span>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="w-11 h-6 rounded-full relative transition-colors shrink-0"
            style={{ backgroundColor: notificationsEnabled ? 'var(--color-bronze)' : 'var(--color-border)' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{ transform: notificationsEnabled ? 'translateX(-1.25rem)' : 'translateX(-0.125rem)', right: 0 }}
            />
          </button>
        </div>
      </section>

      {/* Favorites link */}
      <section className="mb-5">
        <Link
          to="/favorites"
          className="rounded-xl border border-border bg-card p-3 flex flex-row-reverse items-center gap-3"
        >
          <Heart size={20} className="text-destructive" />
          <span className="flex-1 text-sm font-semibold text-text text-right">المفضلة</span>
          <ChevronLeft size={16} className="text-muted-foreground" />
        </Link>
      </section>

      <p className="text-center text-xs text-muted-foreground">فريق ألفا للتعريب</p>
    </div>
  );
}
