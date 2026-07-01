// pages/DownloadsPage.tsx
// ponytail: مُعاد كتابتها بالكامل لتطابق web/src/pages/DownloadsPage.tsx —
// جدول لكل التحميلات الفردية (لا تجميع حسب آخر إصدار فقط كما في team-apk)،
// + بحث + فلتر مشروع + إحصائيات سريعة + تحميل تدريجي. اكتُشف الفرق بفحص
// منهجي بعد سؤال المستخدم عن وجود نقص.
import { useCallback, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useDownloadsPage } from '@/hooks/queries/useDownloadsPage';
import { useProjects } from '@/hooks/queries/useProjects';
import { useInfiniteScrollSentinel } from '@/hooks/useInfiniteScroll';
import type { Download } from '@/types';

const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  stable: { label: 'مستقر', className: 'bg-success/10 text-success' },
  beta: { label: 'تجريبي', className: 'bg-bronze/10 text-bronze' },
  old: { label: 'قديم', className: 'bg-muted text-muted-foreground' },
  جديد: { label: 'جديد', className: 'bg-success/10 text-success' },
  'محدّث': { label: 'محدّث', className: 'bg-bronze/10 text-bronze' },
};

export function DownloadsPage() {
  const {
    data: downloadsData,
    isLoading: downloadsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDownloadsPage();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const loading = downloadsLoading || projectsLoading;

  const downloads: Download[] = useMemo(() => downloadsData?.pages.flat() ?? [], [downloadsData]);

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const hasActiveFilter = Boolean(search || projectFilter);

  const handleIntersect = useCallback(() => {
    if (!hasActiveFilter && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasActiveFilter, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScrollSentinel(handleIntersect, !hasActiveFilter && Boolean(hasNextPage));

  const projectNames = useMemo(() => {
    const names: Record<string, string> = {};
    projects.forEach((p) => {
      names[p.id] = p.name;
    });
    return names;
  }, [projects]);

  const filtered = downloads.filter((d) => {
    if (projectFilter && d.project_id !== projectFilter) return false;
    const projectName = projectNames[d.project_id] || '';
    const version = d.changelog?.version || '';
    return projectName.includes(search) || version.includes(search) || d.type.includes(search);
  });

  // ponytail: نفس تقريب web (downloads.length * 10) — رقم تقديري تسويقي
  // وليس عداد دقيق فعلي من السيرفر.
  const totalDownloads = downloads.length * 10;
  const activeCount = downloads.filter((d) => d.status === 'stable' || d.status === 'جديد').length;

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-5xl mx-auto pt-20 md:pt-10 pb-16 px-5">
      {/* Hero */}
      <div className="flex flex-col items-end gap-2.5 mb-7">
        <div className="flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full border border-bronze/30 bg-bronze/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          <span className="text-[11px] font-semibold text-bronze/90">{downloads.length} ملف</span>
        </div>
        <p className="text-xs font-bold tracking-widest text-bronze">— التحميلات</p>
        <h1 className="text-[28px] md:text-4xl font-black text-right font-[family-name:var(--font-cairo)]">
          <span className="text-bronze">تحميل </span>
          <span className="text-text">التعريبات</span>
        </h1>
        <p className="text-sm leading-[1.8] text-muted-foreground text-right max-w-md">
          جميع إصدارات فريق ألفا في مكان واحد — دائماً مجانية ودائماً نظيفة
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن ملف..."
          dir="rtl"
          className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card text-sm text-text placeholder:text-muted-foreground outline-none focus:border-bronze/50 text-right"
        />
        <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Project filter chips */}
      <div className="flex flex-row-reverse flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setProjectFilter('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            projectFilter === '' ? 'border-bronze bg-bronze/10 text-bronze' : 'border-bronze/20 text-muted-foreground'
          }`}
        >
          الكل
        </button>
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setProjectFilter(p.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              projectFilter === p.id ? 'border-bronze bg-bronze/10 text-bronze' : 'border-bronze/20 text-muted-foreground'
            }`}
          >
            {p.title || p.name}
          </button>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          ['إجمالي التحميلات', `${totalDownloads.toLocaleString('en-US')}+`],
          ['إصدارات نشطة', String(activeCount)],
          ['ملفات متاحة', String(downloads.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-card p-3.5 text-center">
            <p className="text-[1.4rem] font-black text-bronze font-[family-name:var(--font-cairo)]">{v}</p>
            <p className="text-xs text-muted-foreground mt-1">{k}</p>
          </div>
        ))}
      </div>

      {/* Table — جدول حقيقي من sm فأعلى، بطاقات تحت ذلك. min-w-[480px]
          السابقة كانت تفرض عرضاً أوسع من شاشة الهاتف فيضطر الجدول لتمرير
          أفقي صامت بدون أي مؤشر بصري، يفقد المستخدم عمود "المشروع" أو يرى
          الإصدار مقطوعاً خارج حافة الشاشة. */}
      <div className="hidden sm:block rounded-2xl border border-bronze/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-right min-w-[480px]">
          <thead>
            <tr className="bg-bronze/[0.04]">
              <th className="p-3 text-xs font-bold text-muted-foreground">المشروع</th>
              <th className="p-3 text-xs font-bold text-muted-foreground">الإصدار</th>
              <th className="p-3 text-xs font-bold text-muted-foreground">النوع</th>
              <th className="p-3 text-xs font-bold text-muted-foreground">الحالة</th>
              <th className="p-3 text-xs font-bold text-muted-foreground">تحميل</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const s = STATUS_STYLE[d.status] || STATUS_STYLE.old;
              const pName = projectNames[d.project_id] || d.project_id;
              return (
                <tr key={d.id} className="border-t border-border hover:bg-bronze/[0.03] transition-colors">
                  <td className="p-3 text-sm font-bold text-text">{pName}</td>
                  <td className="p-3 text-[13px] font-mono text-bronze">{d.changelog?.version || '-'}</td>
                  <td className="p-3 text-xs text-muted-foreground">{d.type}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${s.className}`}>{s.label}</span>
                  </td>
                  <td className="p-3">
                    <a
                      href={d.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-[10px] bg-bronze text-primary-foreground text-xs font-bold inline-block"
                    >
                      تحميل
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list — تحت sm، بدل الجدول بالكامل */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.map((d) => {
          const s = STATUS_STYLE[d.status] || STATUS_STYLE.old;
          const pName = projectNames[d.project_id] || d.project_id;
          return (
            <div key={d.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text">{pName}</span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${s.className}`}>{s.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground/70">الإصدار</span>
                  <span className="text-[13px] font-mono text-bronze">{d.changelog?.version || '-'}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground/70">النوع</span>
                  <span className="text-xs text-muted-foreground">{d.type}</span>
                </div>
              </div>
              <a
                href={d.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-3.5 py-2 rounded-[10px] bg-bronze text-primary-foreground text-xs font-bold"
              >
                تحميل
              </a>
            </div>
          );
        })}
      </div>

      {!hasActiveFilter && hasNextPage && <div ref={sentinelRef} className="h-1" />}
      {!hasActiveFilter && isFetchingNextPage && (
        <p className="text-center py-5 text-[13px] text-muted-foreground">جارٍ تحميل المزيد...</p>
      )}

      {/* Notice */}
      <div className="mt-5 p-3.5 rounded-[10px] border border-bronze/[0.12] bg-bronze/[0.05] text-xs leading-[1.7] text-muted-foreground">
        جميع التعريبات غير رسمية ولأغراض شخصية فقط. يرجى شراء النسخ الأصلية لدعم المطورين.
      </div>
    </div>
  );
}
