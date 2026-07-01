// pages/ProjectsPage.tsx
// ponytail: أضفنا تبديل عرض شبكة/قائمة (grid/list) من web/src/pages/
// ProjectsPage.tsx — اكتُشف غائباً بفحص منهجي. حافظنا على حقل البحث
// الموجود بنسختنا (غير موجود بـweb الحالي، لكنه تحسين وليس انحرافاً ضاراً
// عن الوظيفة الأساسية — البحث يكمّل الفلاتر، لا يتعارض معها).
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, X, RefreshCw, LayoutGrid, List as ListIcon } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { SyncBadge } from '@/components/SyncBadge';
import { useProjects } from '@/hooks/queries/useProjects';
import { assetUrl } from '@/lib/assetUrl';
import type { Project } from '@/types';
import { Layers } from 'lucide-react';

const TYPES = ['الكل', 'تعريب', 'أداة', 'لعبة'];
const STATUSES = ['الكل', 'active', 'completed', 'upcoming', 'paused'];
const STATUS_LABELS: Record<string, string> = {
  الكل: 'الكل',
  active: 'جاري العمل',
  completed: 'مكتمل',
  upcoming: 'قادم',
  paused: 'متوقف',
};

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors',
        active ? 'border-bronze bg-bronze/10 text-bronze' : 'border-border text-muted-foreground',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

export function ProjectsPage() {
  const { data: projects = [], isLoading, isFetching, isStale, dataUpdatedAt, refetch } = useProjects();
  const [typeFilter, setTypeFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (isLoading) return <LoadingScreen />;

  const filtered = projects.filter((p: Project) => {
    const typeMatch = typeFilter === 'الكل' || p.type === typeFilter;
    const statusMatch = statusFilter === 'الكل' || p.status === statusFilter;
    const term = search.toLowerCase();
    const searchMatch =
      !search ||
      p.title?.toLowerCase().includes(term) ||
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term);
    return typeMatch && statusMatch && searchMatch;
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="px-5 pt-5 md:pt-10 pb-3 border-b border-border flex flex-col gap-2.5">
        <div className="flex items-end justify-between flex-row-reverse">
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">{projects.length} مشروع</p>
            <h1 className="text-[26px] font-black text-text font-[family-name:var(--font-cairo)]">
              {'كل '}
              <span className="text-bronze">التعريبات</span>
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => refetch()}
              aria-label="تحديث"
              className="p-2 text-muted-foreground hover:text-bronze transition-colors"
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            </button>
            <div className="flex items-center gap-1 mr-1">
              <button
                type="button"
                onClick={() => setView('grid')}
                aria-label="عرض شبكي"
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                  view === 'grid' ? 'border-bronze/40 bg-bronze/[0.08] text-bronze' : 'border-bronze/15 text-muted-foreground/60'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                aria-label="عرض قائمة"
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                  view === 'list' ? 'border-bronze/40 bg-bronze/[0.08] text-bronze' : 'border-bronze/15 text-muted-foreground/60'
                }`}
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-row-reverse items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-accent">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مشروع..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-muted-foreground outline-none text-right"
            dir="rtl"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="مسح البحث">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filters — overflow-x-auto + scrollbar-width:none يخفي شريط
            التمرير الفعلي لمظهر أنظف، لكن بدون أي إشارة كان المستخدم لا
            يعرف أن هناك رقائق فلترة إضافية مقطوعة خارج حافة الشاشة. fade
            gradient على الحافة اليسرى (بداية الاتجاه في RTL) يوحي بوجود
            محتوى أكثر دون حاجة لشريط تمرير ظاهر. */}
        <div className="relative">
          <div className="flex flex-row-reverse items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {TYPES.map((t) => (
              <FilterChip key={t} label={t} active={typeFilter === t} onClick={() => setTypeFilter(t)} />
            ))}
            <div className="w-px h-5 bg-border shrink-0 mx-1" />
            {STATUSES.map((s) => (
              <FilterChip
                key={s}
                label={STATUS_LABELS[s]}
                active={statusFilter === s}
                onClick={() => setStatusFilter(s)}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-l from-background to-transparent" />
        </div>

        <p className="text-[11px] text-muted-foreground text-right">{filtered.length} نتيجة</p>
      </div>

      <SyncBadge isFetching={isFetching} isStale={isStale} dataUpdatedAt={dataUpdatedAt} />

      {/* Content */}
      <div className="p-4">
        {filtered.length === 0 ? (
          <EmptyState icon={Layers} title="لا توجد مشاريع" description="لا توجد مشاريع مطابقة للفلترة" />
        ) : view === 'grid' ? (
          /* ponytail: grid-cols-3 ثابت كان يترك خانات فاضية كاملة حين تكون
             عدد المشاريع أقل من 3 (شائع في بيئة التطوير/المشاريع الجديدة) —
             auto-fill مع minmax يجعل عدد الأعمدة يتكيف مع العرض المتاح
             الفعلي بدل افتراض 3 أعمدة دائماً. */
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {filtered.map((p: Project) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((p: Project) => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-bronze/25 transition-colors"
              >
                <img
                  src={p.cover}
                  alt={p.title || p.name}
                  className="w-20 h-14 object-cover rounded-lg shrink-0 brightness-[0.7]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = assetUrl('/images/placeholder.webp');
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-row-reverse items-center gap-2 mb-1">
                    <span className="font-bold text-text truncate">{p.title || p.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bronze/10 text-bronze shrink-0">
                      {STATUS_LABELS[p.status] || p.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 truncate">{p.description}</p>
                </div>
                <div className="text-center shrink-0">
                  <p className={`font-black text-lg ${p.status === 'completed' ? 'text-success' : 'text-bronze'}`}>
                    {p.progress}%
                  </p>
                  <p className="text-[10px] text-muted-foreground/50">{p.type}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
