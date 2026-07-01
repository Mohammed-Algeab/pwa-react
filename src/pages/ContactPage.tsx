// pages/ContactPage.tsx
// ponytail: منقول من web/src/pages/ContactPage.tsx — هذي صفحة لم تكن موجودة
// بـteam-apk أصلاً (أُضيفت لـweb بعد إلغاء team-apk)، فلم تُنقل بالدفعة
// الأولى. صفحة مستقلة عن "تواصل معنا" بصفحة MorePage/JoinPage.
import { ExternalLink, Mail, MessageCircle, Send } from 'lucide-react';
import { useSiteSettings } from '@/hooks/queries/useSiteSettings';
import { LoadingScreen } from '@/components/LoadingScreen';

const CONTACT_METHODS = [
  { key: 'telegram_channel', label: 'قناة التيليغرام', desc: 'آخر الأخبار والإصدارات', Icon: MessageCircle },
  { key: 'telegram_group', label: 'مجموعة التيليغرام', desc: 'للنقاش والدعم والاستفسارات', Icon: Send },
  { key: 'email', label: 'البريد الإلكتروني', desc: 'للمراسلات الرسمية', Icon: Mail },
] as const;

export function ContactPage() {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) return <LoadingScreen />;

  const hasContact = settings?.telegram_channel || settings?.telegram_group || settings?.email;

  return (
    <div className="max-w-2xl mx-auto pt-20 md:pt-10 pb-10 px-5">
      <div className="flex flex-col items-end gap-2.5 mb-8">
        <div className="flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full border border-bronze/30 bg-bronze/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          <span className="text-[11px] font-semibold text-bronze/90">نحن هنا من أجلك</span>
        </div>
        <p className="text-xs font-bold tracking-widest text-bronze">— التواصل</p>
        <h1 className="text-[28px] md:text-4xl font-black text-text text-right font-[family-name:var(--font-cairo)]">
          {'تواصل '}
          <span className="text-bronze">معنا</span>
        </h1>
        <p className="text-sm leading-[22px] text-muted-foreground text-right max-w-md">
          نحن هنا للإجابة على استفساراتك. تواصل معنا عبر أي من القنوات التالية.
        </p>
      </div>

      {hasContact ? (
        <div className="flex flex-col gap-3.5">
          {CONTACT_METHODS.map(({ key, label, desc, Icon }) => {
            const value = settings?.[key as keyof typeof settings] as string | undefined;
            if (!value) return null;
            const link = key === 'email' ? `mailto:${value}` : value;

            return (
              <a
                key={key}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row-reverse items-center gap-4 p-[22px] rounded-2xl border border-border bg-card hover:border-bronze/35 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-bronze/[0.12] border border-bronze/20 flex items-center justify-center text-bronze shrink-0">
                  <Icon size={22} />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-sm text-text mb-0.5">{label}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ExternalLink size={16} className="text-bronze/50 shrink-0" />
              </a>
            );
          })}
        </div>
      ) : (
        <p className="text-center py-16 text-muted-foreground">لم يتم إضافة معلومات تواصل بعد.</p>
      )}

      {/* CTA */}
      <div className="mt-10 p-7 rounded-[20px] border border-bronze/[0.18] bg-gradient-to-br from-bronze/[0.08] to-bronze/[0.03] text-center">
        <h3 className="text-[1.1rem] font-bold text-text mb-2.5 font-[family-name:var(--font-cairo)]">
          هل تريد الانضمام للفريق؟
        </h3>
        <p className="text-[13px] text-muted-foreground mb-4 leading-[1.7]">
          نبحث دائماً عن مواهب جديدة في الترجمة والبرمجة والتصميم.
        </p>
        <a
          href={settings?.telegram_group || 'https://t.me/AlphaTeamChat'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex px-6 py-3 rounded-xl bg-bronze text-primary-foreground font-bold text-sm"
        >
          انضم الآن
        </a>
      </div>
    </div>
  );
}
