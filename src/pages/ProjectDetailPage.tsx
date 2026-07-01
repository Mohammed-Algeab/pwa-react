// pages/ProjectDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Heart, Share2, Download as DownloadIcon } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { LatestVersionCard } from '@/components/LatestVersionCard';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { LoadingScreen } from '@/components/LoadingScreen';
import { GiscusComments, getGiscusTerm, getShareUrl } from '@/components/GiscusComments';
import { useProjects } from '@/hooks/queries/useProjects';
import { useDownloads } from '@/hooks/queries/useDownloads';
import { useChangelogs } from '@/hooks/queries/useChangelogs';
import { useFavorites } from '@/contexts/FavoritesContext';
import { usePageView } from '@/hooks/usePageView';
import { AlertCircle } from 'lucide-react';
import type { Project, Download } from '@/types';

function formatDate(str: string) {
  try {
    return new Date(str).toLocaleDateString('en-US');
  } catch {
    return str;
  }
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  usePageView('project', id);
  const { data: projects = [], isFetching } = useProjects();
  const { data: downloads = [] } = useDownloads();
  const { data: changelogs = [] } = useChangelogs();
  const [imgError, setImgError] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const project: Project | undefined = projects.find((p) => p.id === id);
  const projectDownloads: Download[] = downloads.filter((d) => d.project_id === id);
  const projectChangelogs = changelogs
    .filter((l) => l.project_id === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!project && isFetching) return <LoadingScreen />;

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <EmptyState icon={AlertCircle} title="المشروع غير موجود" message="لم يعد هذا المشروع متاحاً" />
        <Link
          to="/"
          className="mx-10 mt-5 py-3.5 rounded-[10px] bg-bronze text-primary-foreground text-center font-bold"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const progressColorClass = project.status === 'completed' ? 'text-success' : 'text-bronze';
  const progressBgClass = project.status === 'completed' ? 'bg-success' : 'bg-bronze';
  const favored = isFavorite(project.id);

  const handleShare = async () => {
    const shareUrl = getShareUrl('project', project.id);
    const title = project.title || project.name;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // المستخدم ألغى المشاركة — لا حاجة لأي معالجة
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="رجوع"
        className="fixed md:absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 flex items-center justify-center"
      >
        <ArrowRight size={20} className="text-text" />
      </button>

      {/* Favorite + Share */}
      <div className="fixed md:absolute top-4 left-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => toggleFavorite(project.id)}
          aria-label={favored ? 'إزالة من المفضّلة' : 'إضافة للمفضّلة'}
          className="w-10 h-10 rounded-xl bg-black/70 flex items-center justify-center"
        >
          <Heart size={18} className={favored ? 'fill-destructive text-destructive' : 'text-text'} />
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="مشاركة"
          className="w-10 h-10 rounded-xl bg-black/70 flex items-center justify-center"
        >
          <Share2 size={18} className="text-text" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto pb-10">
        {/* Cover */}
        <div className="relative h-[260px] md:h-[340px] md:rounded-b-3xl overflow-hidden">
          {!imgError && project.cover ? (
            <img
              src={project.cover}
              alt={project.title || project.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            /* ponytail: بدل لون فاضي فقط، نضيف حرف أول من اسم المشروع كـ
               visual anchor يملأ الفراغ ويوضح أن هذا placeholder مقصود
               وليس خطأ في التحميل. */
            <div className="w-full h-full bg-accent flex items-center justify-center">
              <span className="text-7xl font-black text-bronze/20 select-none font-[family-name:var(--font-cairo)]">
                {(project.title || project.name || '؟').charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 h-[120px] bg-gradient-to-t from-background/90 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 md:p-8 flex flex-col gap-4">
          <div className="flex flex-col items-end gap-2.5">
            <StatusBadge status={project.status} />
            <h1 className="text-2xl md:text-3xl font-black text-text text-right leading-tight font-[family-name:var(--font-cairo)]">
              {project.title || project.name}
            </h1>
          </div>

          <div className="flex flex-row-reverse gap-2">
            <span className="px-2.5 py-1 rounded-full border border-border text-xs font-semibold text-bronze">
              {project.type}
            </span>
            {project.latest_version && (
              <span className="px-2.5 py-1 rounded-full border border-border text-xs font-semibold text-muted-foreground">
                {project.latest_version}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row-reverse justify-between items-center">
              <span className={`text-[22px] font-black ${progressColorClass}`}>{project.progress}%</span>
              <span className="text-[13px] text-muted-foreground">نسبة الإنجاز</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className={`h-full rounded-full ${progressBgClass}`} style={{ width: `${project.progress}%` }} />
            </div>
          </div>

          {/* Download button */}
          {project.download_link && (
            <a
              href={project.download_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-[10px] bg-bronze text-primary-foreground font-bold"
            >
              <DownloadIcon size={18} />
              تحميل التعريب
            </a>
          )}

          {/* Description */}
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2.5">
            <div className="flex flex-row-reverse items-center justify-between">
              <h2 className="text-base font-bold text-text text-right">عن المشروع</h2>
              <CopyLinkButton shareUrl={getShareUrl('project', project.id)} />
            </div>
            <p className="text-sm leading-[22px] text-muted-foreground text-right">{project.description}</p>
          </div>

          <LatestVersionCard
            projectId={project.id}
            changelogs={projectChangelogs}
            downloads={projectDownloads}
          />

          {project.struggle_story && (
            <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2.5">
              <h2 className="text-base font-bold text-text text-right">قصة الكفاح</h2>
              <p className="text-sm leading-[22px] text-muted-foreground text-right">{project.struggle_story}</p>
            </div>
          )}

          {project.timeline && project.timeline.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2.5">
              <h2 className="text-base font-bold text-text text-right">الجدول الزمني</h2>
              {project.timeline.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-3 py-2.5 items-start ${
                    i < project.timeline!.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex flex-col items-end min-w-20">
                    <span className="text-[13px] font-bold text-bronze">{item.version}</span>
                    <span className="text-[11px] text-muted-foreground">{formatDate(item.date)}</span>
                  </div>
                  <span className="flex-1 text-[13px] leading-5 text-muted-foreground text-right">
                    {item.notes}
                  </span>
                </div>
              ))}
            </div>
          )}

          <GiscusComments term={getGiscusTerm('project', project.id)} />
        </div>
      </div>
    </div>
  );
}
