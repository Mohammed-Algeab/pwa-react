// pages/VersionsPage.tsx
import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Clock, Download as DownloadIcon } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useProjects } from '@/hooks/queries/useProjects';
import { useChangelogs } from '@/hooks/queries/useChangelogs';
import { useDownloads } from '@/hooks/queries/useDownloads';

function formatDate(str: string) {
  try {
    return new Date(str).toLocaleDateString('en-US');
  } catch {
    return str;
  }
}

const TYPE_LABEL: Record<string, string> = { patch: 'تصحيح', full: 'كامل', dlc: 'إضافة' };

export function VersionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: changelogs = [], isLoading: changelogsLoading } = useChangelogs();
  const { data: downloads = [], isLoading: downloadsLoading } = useDownloads();
  const loading = projectsLoading || changelogsLoading || downloadsLoading;
  const [query, setQuery] = useState('');

  const project = projects.find((p) => p.id === id);

  const projectChangelogs = useMemo(
    () =>
      changelogs
        .filter((cg) => cg.project_id === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [changelogs, id]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projectChangelogs;
    return projectChangelogs.filter((cg) => cg.version.toLowerCase().includes(q));
  }, [projectChangelogs, query]);

  const downloadsFor = (changelogId: string) => downloads.filter((d) => d.changelog_id === changelogId);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between px-4 pt-5 md:pt-8 pb-3 border-b border-border">
        <button type="button" onClick={() => navigate(-1)} aria-label="رجوع">
          <ArrowRight size={22} className="text-muted-foreground" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-base font-bold text-text truncate">الإصدارات السابقة</p>
          {project && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{project.title || project.name}</p>
          )}
        </div>
        <span className="w-[22px]" />
      </div>

      <div className="flex flex-row-reverse items-center gap-2 m-4 mb-0 px-3 py-2.5 rounded-xl border border-border bg-accent">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث برقم الإصدار..."
          className="flex-1 bg-transparent text-sm text-text placeholder:text-muted-foreground outline-none text-right"
          dir="rtl"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState icon={Clock} title={query ? `لا توجد نتائج لـ "${query}"` : 'لا توجد إصدارات سابقة'} />
        ) : (
          filtered.map((item, index) => {
            const isLatest = index === 0 && !query;
            const dls = downloadsFor(item.id);
            return (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2.5">
                <div className="flex flex-row-reverse justify-between items-center">
                  <div className="flex flex-row-reverse items-center gap-2">
                    <span className="text-[13px] font-bold px-2.5 py-[3px] rounded-full bg-bronze text-primary-foreground">
                      v{item.version}
                    </span>
                    {isLatest && <span className="text-[11px] font-bold text-success">آخر إصدار</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
                </div>

                {(item.changes || []).length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {item.changes.map((ch, i) => (
                      <div key={i} className="flex flex-row-reverse items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5 shrink-0" />
                        <span className="flex-1 text-[13px] leading-5 text-text text-right">{ch}</span>
                      </div>
                    ))}
                  </div>
                )}

                {dls.length > 0 && (
                  <div className="border-t border-border pt-2.5 flex flex-col gap-2">
                    {dls.map((d) => (
                      <a
                        key={d.id}
                        href={d.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-row-reverse items-center gap-2.5 p-2.5 rounded-[10px] bg-accent"
                      >
                        <DownloadIcon size={14} className="text-bronze shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-text text-right truncate">{d.title}</p>
                          <p className="text-[11px] text-muted-foreground text-right mt-0.5">
                            {TYPE_LABEL[d.type] || d.type} · {d.status === 'beta' ? 'تجريبي' : 'مستقر'}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
