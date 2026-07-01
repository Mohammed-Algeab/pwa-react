// pages/GlossaryPage.tsx
// ponytail: محدّث ليطابق web/src/pages/GlossaryPage.tsx (النسخة الأحدث) —
// جدول + فلتر حسب المشروع، بدل بطاقات team-apk القديمة بدون فلتر. اكتُشف
// الفرق بفحص منهجي بعد سؤال المستخدم عن النقص.
import { useState, useMemo } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useGlossary } from '@/hooks/queries/useGlossary';
import { useProjects } from '@/hooks/queries/useProjects';

export function GlossaryPage() {
  const { data: glossary = [], isLoading: glossaryLoading } = useGlossary();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const [filterProject, setFilterProject] = useState<string>('all');

  const loading = glossaryLoading || projectsLoading;

  const filtered = useMemo(() => {
    if (filterProject === 'all') return glossary;
    return glossary.filter((g) => g.project_id === filterProject);
  }, [glossary, filterProject]);

  const projectNames = useMemo(() => {
    const map: Record<string, string> = {};
    projects.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [projects]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-5xl mx-auto pt-20 md:pt-10 pb-16 px-5">
      {/* Hero */}
      <div className="flex flex-col items-end gap-2.5 mb-8">
        <div className="flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full border border-bronze/30 bg-bronze/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          <span className="text-[11px] font-semibold text-bronze/90">{glossary.length} مصطلح</span>
        </div>
        <p className="text-xs font-bold tracking-widest text-bronze">— المعجم</p>
        <h1 className="text-[28px] md:text-4xl font-black text-right font-[family-name:var(--font-cairo)]">
          <span className="text-bronze">مصطلحات </span>
          <span className="text-text">التعريب</span>
        </h1>
        <p className="text-sm leading-[1.8] text-muted-foreground text-right max-w-md">
          قائمة المصطلحات وترجماتها المستخدمة في مشاريع الفريق
        </p>
      </div>

      {/* Project filter */}
      {projects.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-row-reverse flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground ml-1">المشروع:</span>
            <button
              type="button"
              onClick={() => setFilterProject('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filterProject === 'all' ? 'border-bronze bg-bronze/10 text-bronze' : 'border-border text-muted-foreground'
              }`}
            >
              الكل
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFilterProject(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  filterProject === p.id ? 'border-bronze bg-bronze/10 text-bronze' : 'border-border text-muted-foreground'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 text-right mt-3">{filtered.length} مصطلح</p>
        </div>
      )}

      {/* Table — جدول حقيقي من sm فأعلى، بطاقات تحت ذلك لتجنب ضغط 4 أعمدة
          (إنجليزي + عربي + سبب + مشروع) في عرض هاتف ضيق. */}
      {filtered.length > 0 ? (
        <>
          <div className="hidden sm:block rounded-2xl border border-bronze/10 overflow-hidden overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-bronze/[0.04]">
                  <th className="p-3 text-xs font-bold text-muted-foreground">المصطلح الأصلي</th>
                  <th className="p-3 text-xs font-bold text-muted-foreground">الترجمة العربية</th>
                  <th className="p-3 text-xs font-bold text-muted-foreground">السبب</th>
                  <th className="p-3 text-xs font-bold text-muted-foreground">المشروع</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-border hover:bg-bronze/[0.03] transition-colors">
                    <td className="p-3 text-sm font-semibold text-text">{item.term_original}</td>
                    <td className="p-3 text-sm font-bold text-bronze font-[family-name:var(--font-cairo)]">
                      {item.term_arabic}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{item.reason || '—'}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {item.project_id ? projectNames[item.project_id] || '—' : 'عام'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden flex flex-col gap-2.5">
            {filtered.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-3.5">
                <div className="flex items-baseline justify-between gap-2.5 mb-1.5">
                  <span className="text-sm font-semibold text-text">{item.term_original}</span>
                  <span className="text-[15px] font-bold text-bronze font-[family-name:var(--font-cairo)]">
                    {item.term_arabic}
                  </span>
                </div>
                {item.reason && (
                  <p className="text-xs text-muted-foreground mb-2">{item.reason}</p>
                )}
                <span className="text-[11px] text-muted-foreground/70">
                  {item.project_id ? projectNames[item.project_id] || '—' : 'عام'}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center py-16 text-muted-foreground">لا توجد مصطلحات مطابقة للفلترة المحددة.</p>
      )}
    </div>
  );
}
