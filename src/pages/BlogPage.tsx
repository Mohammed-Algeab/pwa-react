// pages/BlogPage.tsx
import { useMemo, useState, useCallback } from 'react';
import { Search, X, RefreshCw, BookOpen } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { SyncBadge } from '@/components/SyncBadge';
import { usePostsPage } from '@/hooks/queries/usePostsPage';
import { useProjects } from '@/hooks/queries/useProjects';
import { usePostCategories } from '@/hooks/queries/usePostCategories';
import { useInfiniteScrollSentinel } from '@/hooks/useInfiniteScroll';
import type { Post } from '@/types';

function Chip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-colors"
      style={{
        borderColor: active ? color : 'var(--color-border)',
        backgroundColor: active ? `${color}22` : 'transparent',
        color: active ? color : 'var(--color-muted-foreground)',
      }}
    >
      {label}
    </button>
  );
}

export function BlogPage() {
  const {
    data: postsData,
    isLoading: postsLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isStale,
    dataUpdatedAt,
    refetch: refetchPosts,
  } = usePostsPage();
  const { data: projects = [], isLoading: projectsLoading, refetch: refetchProjects } = useProjects();
  const {
    data: postCategories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = usePostCategories();

  const loading = postsLoading || projectsLoading || categoriesLoading;
  const posts: Post[] = useMemo(() => postsData?.pages.flat() ?? [], [postsData]);
  const refetch = () => {
    refetchPosts();
    refetchProjects();
    refetchCategories();
  };

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [activeProject, setActiveProject] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const hasActiveFilter = Boolean(search || activeTag || activeProject || activeCategory);

  const handleIntersect = useCallback(() => {
    if (!hasActiveFilter && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasActiveFilter, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScrollSentinel(handleIntersect, !hasActiveFilter && Boolean(hasNextPage));

  if (loading) return <LoadingScreen />;

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  const term = search.toLowerCase();
  const filtered = posts.filter((p: Post) => {
    const searchMatch = !search || p.title?.toLowerCase().includes(term) || p.excerpt?.toLowerCase().includes(term);
    const tagMatch = !activeTag || (p.tags && p.tags.includes(activeTag));
    const projectMatch = !activeProject || p.project_id === activeProject;
    const categoryMatch = !activeCategory || p.category_id === activeCategory;
    return searchMatch && tagMatch && projectMatch && categoryMatch;
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="px-5 pt-5 md:pt-10 pb-3 border-b border-border flex flex-col gap-2.5">
        <div className="flex items-end justify-between flex-row-reverse">
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">{posts.length} مقالة</p>
            <h1 className="text-[26px] font-black text-text font-[family-name:var(--font-cairo)]">
              {'آخر '}
              <span className="text-bronze">التحديثات</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={refetch}
            aria-label="تحديث"
            className="p-2 text-muted-foreground hover:text-bronze transition-colors"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-row-reverse items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-accent">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في المدونة..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-muted-foreground outline-none text-right"
            dir="rtl"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="مسح البحث">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Categories — fade على الحافة يوحي بوجود رقائق إضافية قابلة
            للتمرير (scrollbar-width:none يخفي شريط التمرير الفعلي). */}
        {postCategories.length > 0 && (
          <div className="relative">
            <div className="flex flex-row-reverse gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {[{ id: '', name: 'الكل', color: 'var(--color-bronze)' }, ...postCategories].map((cat) => (
                <Chip
                  key={cat.id || 'all-cat'}
                  label={cat.name}
                  active={activeCategory === cat.id}
                  color={cat.color}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-l from-background to-transparent" />
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="relative">
            <div className="flex flex-row-reverse gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {[{ id: '', title: 'كل المشاريع', name: '' }, ...projects].map((p) => (
                <Chip
                  key={p.id || 'all-proj'}
                  label={p.title || p.name}
                  active={activeProject === p.id}
                  color="var(--color-bronze)"
                  onClick={() => setActiveProject(activeProject === p.id ? '' : p.id)}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-l from-background to-transparent" />
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="relative">
            <div className="flex flex-row-reverse gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {['', ...allTags].map((tag) => (
                <Chip
                  key={tag || 'all'}
                  label={tag || 'الكل'}
                  active={activeTag === tag}
                  color="var(--color-bronze)"
                  onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-l from-background to-transparent" />
          </div>
        )}
      </div>

      <SyncBadge isFetching={isFetching && !isFetchingNextPage} isStale={isStale} dataUpdatedAt={dataUpdatedAt} />

      {/* Grid */}
      <div className="p-4">
        {filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="لا توجد مقالات" description="لا توجد مقالات مطابقة" />
        ) : (
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {filtered.map((p: Post) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {/* Sentinel للتمرير اللامحدود — غير مرئي، يطلق التحميل التالي عند الاقتراب منه */}
        {!hasActiveFilter && hasNextPage && <div ref={sentinelRef} className="h-1" />}

        {!hasActiveFilter && isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 rounded-full border-[3px] border-border border-t-bronze animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
