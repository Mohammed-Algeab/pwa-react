// pages/AboutPage.tsx
import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SyncBadge } from '@/components/SyncBadge';
import { useTeam } from '@/hooks/queries/useTeam';
import { useProjects } from '@/hooks/queries/useProjects';
import { useSiteSettings } from '@/hooks/queries/useSiteSettings';
import { useCredits } from '@/hooks/queries/useCredits';
import { useSiteFeatures } from '@/hooks/queries/useSiteFeatures';
import type { TeamMember } from '@/types';

function MemberCard({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex flex-row-reverse items-center gap-3.5 p-3.5 rounded-2xl border border-border bg-card">
      {!imgError && member.avatar ? (
        <img
          src={member.avatar}
          alt={member.name}
          className="w-14 h-14 rounded-full object-cover shrink-0"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-bronze/[0.15] flex items-center justify-center shrink-0">
          <span className="text-xl font-black text-bronze">{member.name.charAt(0)}</span>
        </div>
      )}
      <div className="flex-1 flex flex-col items-end gap-1">
        <p className="text-[15px] font-bold text-text text-right">{member.name}</p>
        <p className="text-[13px] text-bronze text-right">{member.role}</p>
      </div>
    </div>
  );
}

export function AboutPage() {
  const {
    data: team = [],
    isLoading: teamLoading,
    isFetching,
    isStale,
    dataUpdatedAt,
  } = useTeam();
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: credits = [], isLoading: creditsLoading } = useCredits();
  const { data: siteFeatures = {}, isLoading: featuresLoading } = useSiteFeatures();

  const loading = teamLoading || settingsLoading || projectsLoading || creditsLoading || featuresLoading;
  if (loading) return <LoadingScreen />;

  // ponytail: إحصائيات منقولة من web/src/pages/AboutPage.tsx — لم تكن
  // موجودة بالنسخة المنقولة أصلاً من team-apk، اكتُشفت بفحص منهجي.
  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.progress === 100);
  const STATS = [
    { label: 'مشروع', value: String(projects.length) },
    { label: 'نشط', value: String(activeProjects.length) },
    { label: 'مكتمل', value: String(completedProjects.length) },
    { label: 'عضو', value: String(team.length) },
  ];

  // ponytail: لاحظنا في الإنتاج أن site_description كانت قيمة مدخلة جزئياً
  // ("تعريب العاب، موقع تعريب،") تنتهي بفاصلة بدون تكملة الجملة — تبدو كـ
  // bug واضح للمستخدم رغم أنها بيانات ناقصة لا خطأ في العرض نفسه. نتجاهل
  // أي وصف ينتهي بفاصلة/واصلة (علامة نص غير مكتمل) أو أقصر من حد معقول.
  const rawDescription = settings?.site_description?.trim();
  const looksTruncated = !rawDescription || rawDescription.length < 15 || /[,،\-—]\s*$/.test(rawDescription);
  const aboutDescription = looksTruncated
    ? 'فريق ألفا للتعريب — فريق متخصص في تعريب الألعاب البصرية والروايات المرئية اليابانية بأعلى جودة ممكنة.'
    : rawDescription;

  return (
    <div className="max-w-2xl mx-auto pt-20 md:pt-10 pb-10">
      <SyncBadge isFetching={isFetching} isStale={isStale} dataUpdatedAt={dataUpdatedAt} />

      <div className="px-5 pb-8 flex flex-col items-end gap-2.5">
        <p className="text-xs font-bold tracking-widest text-bronze">— من نحن</p>
        <h1 className="text-[28px] font-black text-text text-right font-[family-name:var(--font-cairo)]">
          {'عن '}
          <span className="text-bronze">الفريق</span>
        </h1>
        <p className="text-sm leading-[22px] text-muted-foreground text-right">
          {aboutDescription}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 px-5 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-xl font-black text-bronze font-[family-name:var(--font-cairo)]">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {team.length > 0 && (
        <section className="px-5 mb-8 flex flex-col gap-3.5">
          <h2 className="text-xl font-black text-text text-right">
            {'أعضاء '}
            <span className="text-bronze">الفريق</span>
          </h2>
          {team.map((m: TeamMember) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </section>
      )}

      {siteFeatures.credits_section && credits.length > 0 && (
        <section className="px-5 mb-8 flex flex-col gap-3.5">
          <h2 className="text-xl font-black text-text text-right">شكر وتقدير</h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {credits.map((credit) => (
              <div key={credit.id} className="flex justify-between p-3.5">
                <p className="text-[13px] text-muted-foreground">{credit.role}</p>
                <p className="text-sm font-semibold text-text">{credit.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
