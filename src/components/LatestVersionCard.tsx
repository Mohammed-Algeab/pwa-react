// components/LatestVersionCard.tsx
import { Link } from 'react-router-dom';
import { ChevronLeft, Download as DownloadIcon } from 'lucide-react';
import type { ChangelogItem, Download } from '@/types';

function formatDate(str: string) {
  try {
    return new Date(str).toLocaleDateString('en-US');
  } catch {
    return str;
  }
}

const TYPE_LABEL: Record<string, string> = { patch: 'تصحيح', full: 'كامل', dlc: 'إضافة' };

interface LatestVersionCardProps {
  projectId: string;
  changelogs: ChangelogItem[];
  downloads: Download[];
}

export function LatestVersionCard({ projectId, changelogs, downloads }: LatestVersionCardProps) {
  const latest = changelogs[0];
  if (!latest) return null;

  const latestDownloads = downloads.filter((d) => d.changelog_id === latest.id);
  const hasMore = changelogs.length > 1;

  return (
    <div className="rounded-2xl border border-border bg-card p-[18px] flex flex-col gap-3.5 shadow-sm">
      <div className="flex flex-row-reverse justify-between items-center">
        <h3 className="text-[17px] font-extrabold text-text tracking-tight">آخر إصدار</h3>
        {hasMore && (
          <Link
            to={`/versions/${projectId}`}
            className="flex flex-row-reverse items-center gap-1.5 text-[13px] font-extrabold text-bronze"
          >
            الإصدارات السابقة
            <ChevronLeft size={16} />
          </Link>
        )}
      </div>

      <div className="flex flex-row-reverse items-center gap-2.5 -mt-0.5">
        <span className="text-sm font-extrabold px-3 py-1.5 rounded-full bg-bronze text-primary-foreground">
          v{latest.version}
        </span>
        <span className="text-[13px] font-semibold text-muted-foreground">{formatDate(latest.date)}</span>
      </div>

      {(latest.changes || []).length > 0 && (
        <div className="flex flex-col gap-2.5">
          {latest.changes.slice(0, 5).map((ch, i) => (
            <div key={i} className="flex flex-row-reverse items-start gap-2.5">
              <span className="w-[7px] h-[7px] rounded-full bg-bronze mt-[7px] shrink-0" />
              <span className="flex-1 text-sm leading-[22px] text-right font-medium text-text">{ch}</span>
            </div>
          ))}
        </div>
      )}

      {latestDownloads.length > 0 && (
        <div className="border-t border-border pt-3 flex flex-col gap-2.5">
          {latestDownloads.map((d) => (
            <a
              key={d.id}
              href={d.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row-reverse items-center gap-3 p-3 rounded-xl bg-accent"
            >
              <DownloadIcon size={16} className="text-bronze shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text text-right truncate">{d.title}</p>
                <p className="text-xs text-muted-foreground text-right mt-0.5 font-medium">
                  {TYPE_LABEL[d.type] || d.type} · {d.status === 'beta' ? 'تجريبي' : 'مستقر'}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
