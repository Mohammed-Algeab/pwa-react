// pages/JoinPage.tsx
// ponytail: محدّث ليطابق web/src/pages/JoinTeamPage.tsx (النسخة الأحدث، بعد
// إلغاء team-apk) — وليس نسخة team-apk الأصلية (4 أدوار) المُستخدمة هنا
// بمسودة أولى. اكتُشف الفرق بفحص منهجي لكل صفحات web بعد سؤال المستخدم
// "هل يوجد شيء ناقص؟" — كان الجواب نعم، وهذي إحداها.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ExternalLink, FileText, Languages, Gamepad2, Code, Sparkles } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useSiteSettings } from '@/hooks/queries/useSiteSettings';
import { useSiteFeatures } from '@/hooks/queries/useSiteFeatures';

const ROLES = [
  { Icon: FileText, title: 'مترجم', description: 'ترجمة النصوص من اليابانية أو الإنجليزية إلى العربية بأسلوب سلس ودقيق.' },
  { Icon: Languages, title: 'مراجع لغوي', description: 'مراجعة النصوص المترجمة والتأكد من الدقة اللغوية والنحوية والسياقية.' },
  { Icon: Gamepad2, title: 'مختبر', description: 'اختبار التعريب داخل اللعبة والتأكد من ظهور النصوص بشكل صحيح.' },
  { Icon: Code, title: 'مطور', description: 'برمجة أدوات التعريب والباتشات وحل المشاكل التقنية.' },
  { Icon: Sparkles, title: 'مصمم', description: 'تصميم الواجهات والخطوط والأصول البصرية للتعريب.' },
  { Icon: Users, title: 'منسق', description: 'تنسيق العمل بين أعضاء الفريق ومتابعة التقدم.' },
];

export function JoinPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: siteFeatures = {}, isLoading: featuresLoading } = useSiteFeatures();
  const loading = settingsLoading || featuresLoading;

  useEffect(() => {
    if (!loading && !siteFeatures.join_team_page) {
      navigate('/', { replace: true });
    }
  }, [loading, siteFeatures.join_team_page, navigate]);

  if (loading || !siteFeatures.join_team_page) return <LoadingScreen />;

  return (
    <div className="max-w-5xl mx-auto pt-20 md:pt-10 pb-16 px-5">
      {/* Hero */}
      <div className="flex flex-col items-end gap-2.5 mb-10">
        <div className="flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full border border-bronze/30 bg-bronze/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          <span className="text-[11px] font-semibold text-bronze/90">انضم إلينا</span>
        </div>
        <p className="text-xs font-bold tracking-widest text-bronze">— الفريق</p>
        <h1 className="text-[28px] md:text-4xl font-black text-right font-[family-name:var(--font-cairo)]">
          <span className="text-bronze">انضم </span>
          <span className="text-text">للفريق</span>
        </h1>
        <p className="text-sm leading-[1.8] text-muted-foreground text-right max-w-md">
          فريق ألفا للتعريب هو فريق متطوع يعمل على تعريب الألعاب والروايات البصرية — انضم إلينا!
        </p>
      </div>

      {/* Intro */}
      <div className="max-w-2xl mx-auto md:mx-0 p-7 mb-10 rounded-2xl border border-bronze/[0.18] bg-gradient-to-br from-bronze/[0.08] to-bronze/[0.03]">
        <h2 className="text-lg font-bold text-text mb-2.5 font-[family-name:var(--font-cairo)]">عن العمل في الفريق</h2>
        <p className="text-[14px] leading-[1.85] text-muted-foreground">
          فريق ألفا للتعريب هو فريق متطوع يعمل على تعريب الألعاب والروايات البصرية إلى اللغة العربية.
          نبحث دائماً عن أعضاء جدد يشاركوننا الشغف نفسه. العمل مرن ويتم عن بُعد، ولا يتطلب
          خبرة احترافية — فقط الجدية والالتزام.
        </p>
      </div>

      {/* Roles */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold tracking-widest text-bronze">— الأدوار</p>
        <h2 className="text-2xl font-black mt-1">
          <span className="text-text">الأدوار </span>
          <span className="text-bronze">المطلوبة</span>
        </h2>
      </div>
      <div className="grid gap-4 mb-12 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {ROLES.map((role) => (
          <div key={role.title} className="rounded-2xl border border-border bg-card p-6 text-center hover:border-bronze/30 hover:-translate-y-1 transition-all">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-bronze/[0.12] border border-bronze/20 flex items-center justify-center text-bronze mx-auto mb-3.5">
              <role.Icon size={22} />
            </div>
            <h3 className="font-bold text-[15px] text-text mb-2 font-[family-name:var(--font-cairo)]">{role.title}</h3>
            <p className="text-[12px] leading-[1.7] text-muted-foreground">{role.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative max-w-xl mx-auto p-10 rounded-3xl border border-bronze/[0.18] bg-gradient-to-br from-bronze/[0.08] to-bronze/[0.03] text-center overflow-hidden">
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)' }}
        />
        <div className="relative z-[1]">
          <h2 className="text-xl md:text-2xl font-black text-text mb-3 font-[family-name:var(--font-cairo)]">
            هل أنت مهتم بالانضمام؟
          </h2>
          <p className="text-[13px] leading-[1.75] text-muted-foreground mb-6">
            تواصل معنا عبر تيليغرام وسنرشدك للخطوات القادمة.
          </p>
          <a
            href={settings?.telegram_group || 'https://t.me/AlphaTeamChat'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-bronze text-primary-foreground font-bold text-sm"
          >
            تواصل عبر تيليغرام
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
