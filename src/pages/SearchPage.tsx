// pages/SearchPage.tsx
// ponytail: مُعاد كتابتها بالكامل لتطابق web/src/pages/SearchPage.tsx الفعلي
// — فلترة محلية (client-side) على بيانات محمّلة أصلاً، تشمل مشاريع +
// منشورات + تعريبات مستقلة معاً. النسخة الأولى (منقولة من team-apk) استخدمت
// RPC search_content — اكتُشف أن web نفسه لا يستخدم هذي الدالة فعلياً رغم
// وجودها بقاعدة البيانات (كود يتيم/orphaned)، فالأصح مطابقة السلوك الفعلي
// لـweb بدل اتباع team-apk القديم.
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { PostCard } from '@/components/PostCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useProjects } from '@/hooks/queries/useProjects';
import { usePosts } from '@/hooks/queries/usePosts';
import { useIndependent } from '@/hooks/queries/useIndependent';

export function SearchPage() {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { data: independent = [], isLoading: independentLoading } = useIndependent();
  const loading = projectsLoading || postsLoading || independentLoading;

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || '';
  const [query, setQuery] = useState(initialQuery || initialTag);

  useEffect(() => {
    if (initialTag) setQuery(initialTag);
  }, [initialTag]);

  const results = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return { projects: [], posts: [], independent: [] };

    return {
      projects: projects.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.type?.includes(term)
      ),
      posts: posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.content?.toLowerCase().includes(term) ||
          p.tags?.some((t) => t.includes(term))
      ),
      independent: independent.filter(
        (i) => i.name?.toLowerCase().includes(term) || i.description?.toLowerCase().includes(term)
      ),
    };
  }, [query, projects, posts, independent]);

  const totalResults = results.projects.length + results.posts.length + results.independent.length;

  if (loading) return <LoadingScreen />;

  return (
    <div className="pt-20 md:pt-10 pb-16">
      <div className="max-w-2xl mx-auto px-5 mb-7 text-center">
        <p className="text-xs font-bold tracking-widest text-bronze mb-1">— البحث</p>
        <h1 className="text-[28px] md:text-4xl font-black font-[family-name:var(--font-cairo)]">
          <span className="text-bronze">ابحث </span>
          <span className="text-text">في كل شيء</span>
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-5 mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="ابحث في المشاريع والمنشورات والتعريبات..."
            autoFocus
            dir="rtl"
            className="w-full pr-12 pl-4 py-3.5 rounded-xl border border-border bg-card text-text placeholder:text-muted-foreground outline-none focus:border-bronze/50 text-right"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze/50" />
        </div>
      </div>

      {query && (
        <p className="text-center text-[13px] text-muted-foreground mb-6">
          {totalResults} نتيجة لـ "{query}"
        </p>
      )}

      <div className="max-w-5xl mx-auto px-5">
        {totalResults > 0 ? (
          <div className="flex flex-col gap-10">
            {results.projects.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <p className="text-xs font-bold tracking-widest text-bronze">— المشاريع</p>
                  <span className="text-xs text-muted-foreground/50 mr-auto">{results.projects.length}</span>
                </div>
                <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                  {results.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

            {results.posts.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <p className="text-xs font-bold tracking-widest text-bronze">— المنشورات</p>
                  <span className="text-xs text-muted-foreground/50 mr-auto">{results.posts.length}</span>
                </div>
                <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                  {results.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {results.independent.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <p className="text-xs font-bold tracking-widest text-bronze">— تعريبات مستقلة</p>
                  <span className="text-xs text-muted-foreground/50 mr-auto">{results.independent.length}</span>
                </div>
                <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
                  {results.independent.map((item) => (
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-[18px] rounded-2xl border border-border bg-card hover:border-bronze/30 transition-colors"
                    >
                      <span className="inline-block mb-2.5 px-2.5 py-1 rounded-full border border-border text-[11px] font-semibold text-bronze">
                        {item.type}
                      </span>
                      <h3 className="font-bold text-[15px] text-text mb-1.5 font-[family-name:var(--font-cairo)]">
                        {item.name}
                      </h3>
                      <p className="text-[13px] text-muted-foreground">{item.description}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : query ? (
          <p className="text-center py-16 text-muted-foreground">لا توجد نتائج لـ "{query}"</p>
        ) : (
          <div className="flex flex-col items-center gap-2.5 py-20 text-center">
            <Search size={48} className="text-border" />
            <p className="text-base font-semibold text-muted-foreground">ابدأ بالبحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
