// pages/IndependentPage.tsx
// ponytail: محدّث ليطابق web/src/pages/IndependentPage.tsx — يضيف زر "اقترح
// تعريباً" وحقل المُعرب (translator، حقل غير موثّق رسمياً بـtypes/index.ts
// لكنه مستخدم بـweb عبر cast — نطابق نفس السلوك هنا). اكتُشف بفحص منهجي.
import { ExternalLink, Users, Plus } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useIndependent } from '@/hooks/queries/useIndependent';
import { useSiteSettings } from '@/hooks/queries/useSiteSettings';
import type { Independent } from '@/types';

export function IndependentPage() {
  const { data: independent = [], isLoading: independentLoading } = useIndependent();
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const loading = independentLoading || settingsLoading;

  if (loading) return <LoadingScreen />;

  const sorted = [...independent].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-5xl mx-auto pt-20 md:pt-10 pb-16 px-5">
      {/* Hero */}
      <div className="flex flex-col items-end gap-2.5 mb-8">
        <div className="flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full border border-bronze/30 bg-bronze/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          <span className="text-[11px] font-semibold text-bronze/90">{independent.length} تعريب</span>
        </div>
        <p className="text-xs font-bold tracking-widest text-bronze">— جهود مستقلة</p>
        <h1 className="text-[28px] md:text-4xl font-black text-right font-[family-name:var(--font-cairo)]">
          <span className="text-text">التعريبات </span>
          <span className="text-bronze">المستقلة</span>
        </h1>
        <p className="text-sm leading-[1.8] text-muted-foreground text-right max-w-md">
          تعريبات تم إنجازها من قبل مترجمين مستقلين — نحن ندعم ونروج لهذه الجهود.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Users size={48} className="text-bronze/50 mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد تعريبات مستقلة حالياً.</p>
        </div>
      ) : (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {sorted.map((item: Independent) => {
            const translator = (item as unknown as Record<string, unknown>).translator as string | undefined;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-card p-[22px] flex flex-col hover:border-bronze/35 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full border border-border text-[11px] font-semibold text-bronze">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60">
                    {new Date(item.date).toLocaleDateString('en-US')}
                  </span>
                </div>
                <h3 className="font-bold text-[17px] text-text mb-1.5 font-[family-name:var(--font-cairo)]">
                  {item.name}
                </h3>
                <p className="text-[13px] leading-[1.7] text-muted-foreground mb-4 flex-1">{item.description}</p>
                <div className="mt-auto">
                  <p className="text-xs text-bronze/50 mb-3">المُعرب: {translator || item.name}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[10px] bg-bronze text-primary-foreground text-sm font-bold"
                  >
                    تحميل التعريب
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggest button */}
      <div className="mt-12 text-center">
        <a
          href={settings?.telegram_group || 'https://t.me/AlphaTeamChat'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-bronze/30 text-bronze font-semibold text-sm"
        >
          اقترح تعريباً
          <Plus size={16} />
        </a>
      </div>
    </div>
  );
}
