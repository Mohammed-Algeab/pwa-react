// pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { Search, Send, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { PostCard } from '@/components/PostCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SyncBadge } from '@/components/SyncBadge';
import { useProjects } from '@/hooks/queries/useProjects';
import { usePosts } from '@/hooks/queries/usePosts';
import { useSiteSettings } from '@/hooks/queries/useSiteSettings';
import { useIndependent } from '@/hooks/queries/useIndependent';
import { useDiffAware } from '@/hooks/useDiffAware';
import type { Project, Post } from '@/types';

function StatCard({ value, label, colorClass }: { value: string; label: string; colorClass: string }) {
  return (
    <div className="flex-1 p-3 rounded-xl border border-border bg-card flex flex-col items-center gap-1">
      <span className={`text-xl font-black ${colorClass}`}>{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function HomePage() {
  const projectsQuery = useProjects();
  const postsQuery = usePosts();
  const settingsQuery = useSiteSettings();
  const independentQuery = useIndependent();

  // كل مصدر بيانات يمر عبر useDiffAware: البيانات المعروضة (pinned) لا
  // تتغيّر تلقائياً حتى لو وصلت نسخة أحدث بالخلفية — فقط ترفع hasUpdate.
  const projectsD = useDiffAware(projectsQuery);
  const postsD = useDiffAware(postsQuery);
  const settingsD = useDiffAware(settingsQuery);
  const independentD = useDiffAware(independentQuery);

  const projects = projectsD.data ?? [];
  const posts = postsD.data ?? [];
  const settings = settingsD.data;
  const independent = independentD.data ?? [];

  const loading =
    projectsQuery.isLoading || postsQuery.isLoading || settingsQuery.isLoading || independentQuery.isLoading;
  const isFetching = projectsQuery.isFetching || postsQuery.isFetching;
  const hasUpdate = projectsD.hasUpdate || postsD.hasUpdate || settingsD.hasUpdate || independentD.hasUpdate;

  const applyUpdate = () => {
    projectsD.applyUpdate();
    postsD.applyUpdate();
    settingsD.applyUpdate();
    independentD.applyUpdate();
  };

  // زر 🔄 اليدوي: فحص فوري من الشبكة بغض النظر عن staleTime — التحديث
  // الفعلي بالشاشة يبقى يحتاج موافقة عبر بانر hasUpdate (نفس منطق الخلفية).
  const refetch = () => {
    projectsQuery.refetch();
    postsQuery.refetch();
    settingsQuery.refetch();
    independentQuery.refetch();
  };

  if (loading) return <LoadingScreen />;

  const completedProjects = projects.filter((p: Project) => p.progress === 100).length;
  const activeProjects = projects.filter((p: Project) => p.status === 'active').length;
  const featuredProjects = projects
    .filter((p: Project) => p.featured)
    .sort((a: Project, b: Project) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .slice(0, 3);
  const displayProjects =
    featuredProjects.length > 0
      ? featuredProjects
      : projects.filter((p: Project) => p.status === 'active').slice(0, 3);
  const latestPosts = [...posts].slice(0, 3);
  const latestIndependent = [...independent]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-5 pt-4 md:pt-10 pb-10">
      <div className="flex items-center justify-between">
        <SyncBadge isFetching={isFetching} isStale={projectsQuery.isStale} dataUpdatedAt={projectsQuery.dataUpdatedAt} />
        <button
          type="button"
          onClick={refetch}
          aria-label="تحديث"
          className="p-2 text-muted-foreground hover:text-bronze transition-colors"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* بانر التحديث — يظهر فقط لو فيه فرق فعلي عن آخر بيانات مطبَّقة،
          وإلا صامت تماماً بدون أي إزعاج بصري */}
      {hasUpdate && (
        <button
          type="button"
          onClick={applyUpdate}
          className="flex w-full flex-row-reverse items-center justify-center gap-2 mt-2 mb-1 px-3.5 py-2.5 rounded-[10px] border border-bronze/30 bg-bronze/10 text-bronze text-[13px] font-bold"
        >
          <Sparkles size={14} />
          تحديثات جديدة متاحة — اضغط للتحديث
        </button>
      )}

      {/* Search bar */}
      <Link
        to="/search"
        className="flex flex-row-reverse items-center gap-2.5 mx-0 mb-3 mt-2 px-3.5 py-3 rounded-2xl border border-border bg-card"
      >
        <Search size={18} className="text-muted-foreground" />
        <span className="flex-1 text-[15px] text-muted-foreground font-[family-name:var(--font-tajawal)]">
          بحث...
        </span>
      </Link>

      {/* Hero */}
      <div className="flex flex-col items-end gap-3.5 pb-6">
        <div className="flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full border border-bronze/30 bg-bronze/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          <span className="text-[11px] font-semibold text-bronze/90">
            مشاريع التعريب العربي الاحترافي
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-right leading-tight text-text font-[family-name:var(--font-cairo)]">
          {'نُعرِّب ما '}
          <span className="text-bronze">تحبه</span>
        </h1>
        <p className="text-sm leading-6 text-right text-muted-foreground max-w-md">
          {settings?.tagline || 'فريق متخصص في تعريب الألعاب البصرية والروايات المرئية اليابانية'}
        </p>
        <div className="flex flex-row-reverse gap-2.5 flex-wrap">
          <Link
            to="/projects"
            className="flex flex-row-reverse items-center gap-1.5 px-5 py-2.5 rounded-[10px] bg-bronze text-primary-foreground text-sm font-bold"
          >
            استعرض المشاريع
          </Link>
          {settings?.telegram_channel && (
            <a
              href={settings.telegram_channel}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row-reverse items-center gap-1.5 px-4.5 py-2.5 rounded-[10px] border border-bronze/30 text-bronze text-[13px] font-semibold"
            >
              <Send size={14} />
              تيليغرام
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-row-reverse gap-2.5 mb-8">
        <StatCard value={String(completedProjects)} label="مكتمل" colorClass="text-success" />
        <StatCard value={String(activeProjects)} label="نشط" colorClass="text-bronze" />
        <StatCard value={String(projects.length)} label="مشروع" colorClass="text-text" />
        <StatCard value={String(posts.length)} label="مقالة" colorClass="text-muted-foreground" />
      </div>

      {/* Featured projects */}
      {displayProjects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <Link to="/projects" className="text-[13px] font-semibold text-bronze">
              عرض الكل
            </Link>
            <div className="text-right">
              <p className="text-[11px] font-bold tracking-wide text-bronze">— مشاريعنا</p>
              <h2 className="text-[22px] font-black text-text font-[family-name:var(--font-cairo)]">
                {'أبرز '}
                <span className="text-bronze">التعريبات</span>
              </h2>
            </div>
          </div>
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {displayProjects.map((p: Project) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest posts */}
      {latestPosts.length > 0 && (
        <section className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <Link to="/blog" className="text-[13px] font-semibold text-bronze">
              عرض الكل
            </Link>
            <div className="text-right">
              <p className="text-[11px] font-bold tracking-wide text-bronze">— المدونة</p>
              <h2 className="text-[22px] font-black text-text font-[family-name:var(--font-cairo)]">
                {'آخر '}
                <span className="text-bronze">التحديثات</span>
              </h2>
            </div>
          </div>
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {latestPosts.map((p: Post) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* Independent translations */}
      {latestIndependent.length > 0 && (
        <section className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <Link to="/independent" className="text-[13px] font-semibold text-bronze">
              عرض الكل
            </Link>
            <div className="text-right">
              <p className="text-[11px] font-bold tracking-wide text-bronze">— تعريبات مستقلة</p>
              <h2 className="text-[22px] font-black text-text font-[family-name:var(--font-cairo)]">
                {'جهود '}
                <span className="text-bronze">مستقلة</span>
              </h2>
            </div>
          </div>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
            {latestIndependent.map((item) => {
              const translator = (item as unknown as Record<string, unknown>).translator as string | undefined;
              return (
                <div key={item.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full border border-border text-[11px] font-semibold text-bronze">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground/50">
                      {new Date(item.date).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  <h3 className="font-bold text-[16px] text-text mb-1.5 font-[family-name:var(--font-cairo)]">
                    {item.name}
                  </h3>
                  <p className="text-[13px] text-muted-foreground/70 mb-4">المُعرب: {translator || item.name}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[10px] bg-bronze text-primary-foreground text-[13px] font-bold"
                  >
                    تحميل التعريب
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Telegram CTA */}
      {(settings?.telegram_channel || settings?.telegram_group) && (
        <div className="mx-0 mb-5 p-6 rounded-[20px] border border-bronze/[0.18] bg-bronze/[0.05] flex flex-col items-center gap-2.5 text-center">
          <h3 className="text-lg font-black text-text">انضم لمجتمعنا</h3>
          <p className="text-[13px] text-muted-foreground">تابع أحدث الأخبار والإصدارات</p>
          <div className="flex gap-2.5 flex-wrap justify-center mt-1.5">
            {settings.telegram_channel && (
              <a
                href={settings.telegram_channel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] bg-bronze text-primary-foreground text-sm font-bold"
              >
                <Send size={14} />
                القناة
              </a>
            )}
            {settings.telegram_group && (
              <a
                href={settings.telegram_group}
                target="_blank"
                rel="noopener noreferrer"
                className="px-[18px] py-2.5 rounded-[10px] border border-bronze/30 text-bronze text-[13px] font-semibold"
              >
                المجموعة
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
