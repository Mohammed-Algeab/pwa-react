// pages/RoadmapPage.tsx
// ponytail: محدّث ليطابق web/src/pages/RoadmapPage.tsx — إحصائيات سريعة،
// ترتيب حسب أولوية الحالة (لا display_order)، ووصف المشروع بكل بطاقة.
// اكتُشف الفرق بفحص منهجي بعد سؤال المستخدم عن وجود نقص.
import { Map } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { useProjects } from '@/hooks/queries/useProjects';
import type { Project } from '@/types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bgClass: string }> = {
  completed: { label: 'مكتمل', color: 'var(--color-success)', bgClass: 'bg-success/10' },
  active: { label: 'جاري العمل', color: 'var(--color-bronze)', bgClass: 'bg-bronze/10' },
  upcoming: { label: 'قادم قريباً', color: '#6090C0', bgClass: 'bg-[#6090C0]/10' },
  paused: { label: 'متوقف', color: '#DC503C', bgClass: 'bg-[#DC503C]/10' },
};

const STATUS_ORDER = ['completed', 'active', 'upcoming', 'paused'];

export function RoadmapPage() {
  const { data: projects = [], isLoading } = useProjects();

  if (isLoading) return <LoadingScreen />;

  const sorted = [...projects].sort((a, b) => {
    const aIndex = STATUS_ORDER.indexOf(a.status);
    const bIndex = STATUS_ORDER.indexOf(b.status);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const completed = projects.filter((p) => p.status === 'completed').length;
  const active = projects.filter((p) => p.status === 'active').length;
  const upcoming = projects.filter((p) => p.status === 'upcoming').length;

  return (
    <div className="max-w-2xl mx-auto pt-20 md:pt-10 pb-16 px-5">
      {/* Hero */}
      <div className="flex flex-col items-end gap-2.5 mb-7">
        <div className="flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full border border-bronze/30 bg-bronze/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          <span className="text-[11px] font-semibold text-bronze/90">{projects.length} مشروع</span>
        </div>
        <p className="text-xs font-bold tracking-widest text-bronze">— التخطيط</p>
        <h1 className="text-[28px] md:text-4xl font-black text-right font-[family-name:var(--font-cairo)]">
          <span className="text-text">خارطة </span>
          <span className="text-bronze">طريق الفريق</span>
        </h1>
        <p className="text-sm leading-[1.8] text-muted-foreground text-right max-w-md">
          تابع حالة مشاريع التعريب والتخطيط المستقبلي
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="text-center">
          <p className="text-[1.6rem] font-black text-success leading-none">{completed}</p>
          <p className="text-xs text-muted-foreground mt-1">مكتمل</p>
        </div>
        <div className="text-center">
          <p className="text-[1.6rem] font-black text-bronze leading-none">{active}</p>
          <p className="text-xs text-muted-foreground mt-1">جاري العمل</p>
        </div>
        <div className="text-center">
          <p className="text-[1.6rem] font-black leading-none" style={{ color: '#6090C0' }}>{upcoming}</p>
          <p className="text-xs text-muted-foreground mt-1">قادم</p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={Map} title="لا توجد مشاريع" />
      ) : (
        <div className="relative">
          <div className="absolute right-[22px] top-0 bottom-0 w-0.5 bg-bronze/[0.15] rounded-full" />
          <div className="flex flex-col gap-5">
            {sorted.map((project: Project) => {
              const config = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
              return (
                <div key={project.id} className="flex items-start gap-4 relative">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 mt-[18px] z-[2] border-2"
                    style={{ backgroundColor: config.color, borderColor: config.color, boxShadow: `0 0 8px ${config.color}40` }}
                  />
                  <div
                    className="flex-1 rounded-2xl border border-border bg-card p-[18px]"
                    style={{ borderInlineEndColor: config.color, borderInlineEndWidth: 3 }}
                  >
                    <div className="flex flex-row-reverse flex-wrap items-center gap-2 mb-2.5">
                      <span className="ml-auto text-[11px] text-muted-foreground/60">{project.progress}%</span>
                      <span className="px-2 py-0.5 rounded-full border border-border text-[11px] font-semibold text-bronze">
                        {project.type}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${config.bgClass}`} style={{ color: config.color }}>
                        {config.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-[16px] text-text text-right mb-1.5 font-[family-name:var(--font-cairo)]">
                      {project.title || project.name}
                    </h3>
                    <p className="text-[13px] leading-[1.7] text-muted-foreground text-right mb-3">
                      {project.description}
                    </p>
                    <div className="h-[5px] rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${project.progress}%`,
                          background:
                            project.status === 'completed'
                              ? 'linear-gradient(90deg, #50C878, #80E0A0)'
                              : 'linear-gradient(90deg, var(--color-bronze), var(--color-bronze-light))',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
