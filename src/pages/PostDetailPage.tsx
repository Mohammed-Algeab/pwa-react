// pages/PostDetailPage.tsx
// ponytail: مُعاد بناؤها بالكامل — اكتُشف أن post.content هو نص شبه-Markdown
// مبسّط (## للعناوين، - للقوائم) يُفسَّر سطراً بسطر، وليس HTML خام كما
// افترضت النسخة الأولى خطأً (استخدمت DOMPurify + dangerouslySetInnerHTML،
// وهذا كان يعرض "##" و"-" حرفياً بدل تنسيق فعلي). renderContent() هنا تطابق
// web/src/pages/PostDetailPage.tsx بالضبط. أضفنا أيضاً "منشورات ذات صلة"
// وروابط الوسوم لصفحة البحث، وكلاهما كان غائباً.
import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Heart, Calendar, Tag } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PostCard } from '@/components/PostCard';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { GiscusComments, getGiscusTerm, getShareUrl } from '@/components/GiscusComments';
import { usePosts } from '@/hooks/queries/usePosts';
import { useFavorites } from '@/contexts/FavoritesContext';
import { usePageView } from '@/hooks/usePageView';
import type { Post } from '@/types';

function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-bronze font-[family-name:var(--font-cairo)]">
          {line.replace('## ', '')}
        </h2>
      );
    }
    if (line.startsWith('- ')) {
      return (
        <li key={i} className="mr-4 mb-1 text-text">
          {line.replace('- ', '')}
        </li>
      );
    }
    if (line.trim() === '') {
      return <div key={i} className="h-2" />;
    }
    return (
      <p key={i} className="mb-3 leading-relaxed text-text">
        {line}
      </p>
    );
  });
}

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  usePageView('post', id);
  const { data: posts = [], isFetching } = usePosts();
  const { toggleFavorite, isFavorite } = useFavorites();

  const post: Post | undefined = posts.find((p) => p.id === id);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t)))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [post, posts]);

  if (!post && isFetching) return <LoadingScreen />;

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <EmptyState icon={Calendar} title="المقالة غير موجودة" message="لم تعد هذه المقالة متاحة" />
        <Link to="/blog" className="mx-10 mt-5 py-3.5 rounded-[10px] bg-bronze text-primary-foreground text-center font-bold">
          العودة للمدونة
        </Link>
      </div>
    );
  }

  const favored = isFavorite(post.id);
  const shareUrl = getShareUrl('post', post.id);
  const giscusTerm = getGiscusTerm('post', post.id);

  return (
    <div className="relative min-h-screen">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="رجوع"
        className="fixed top-4 right-4 z-10 w-10 h-10 rounded-full border border-bronze/20 bg-background/80 flex items-center justify-center"
      >
        <ArrowRight size={20} className="text-text" />
      </button>

      <button
        type="button"
        onClick={() => toggleFavorite(post.id)}
        aria-label={favored ? 'إزالة من المفضّلة' : 'إضافة للمفضّلة'}
        className="fixed top-4 left-4 z-10 w-10 h-10 rounded-full border border-bronze/20 bg-background/80 flex items-center justify-center"
      >
        <Heart size={18} className={favored ? 'fill-destructive text-destructive' : 'text-text'} />
      </button>

      <article className="max-w-2xl mx-auto px-5 pt-20 pb-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString('en-US')}
            </span>
          </div>
          <CopyLinkButton shareUrl={shareUrl} />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-text text-right leading-snug font-[family-name:var(--font-cairo)]">
          {post.title}
        </h1>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-row-reverse flex-wrap items-center gap-2">
            <Tag size={14} className="text-bronze" />
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/search?tag=${encodeURIComponent(tag)}`}
                className="text-sm px-2 py-0.5 rounded border border-bronze text-bronze hover:opacity-80 transition-opacity font-[family-name:var(--font-cairo)]"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="rounded-2xl border border-bronze/[0.12] bg-bronze/[0.04] p-6 sm:p-8 mt-2">
          <div className="prose-content">{renderContent(post.content)}</div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-4">
            <h2 className="flex flex-row-reverse items-center gap-2 text-xl font-bold text-bronze mb-5 font-[family-name:var(--font-cairo)]">
              منشورات ذات صلة
              <ArrowLeft size={20} />
            </h2>
            <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {relatedPosts.map((rp) => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        )}

        <GiscusComments term={giscusTerm} />
      </article>
    </div>
  );
}
