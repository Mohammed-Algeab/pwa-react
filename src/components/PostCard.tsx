// components/PostCard.tsx
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Post } from '@/types';

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function PostCard({ post }: { post: Post }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favored = isFavorite(post.id);

  return (
    <Link
      to={`/post/${post.id}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden p-[18px] flex flex-col gap-2.5 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-row-reverse items-start justify-between gap-2.5">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-row-reverse flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="border-[1.5px] border-border rounded-full px-2.5 py-1 text-xs font-bold tracking-wide text-bronze"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <button
          type="button"
          aria-label={favored ? 'إزالة من المفضّلة' : 'إضافة للمفضّلة'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(post.id);
          }}
          className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
        >
          <Heart size={18} className={favored ? 'fill-destructive text-destructive' : 'text-muted-foreground'} />
        </button>
      </div>

      <h3 className="text-base font-extrabold text-text text-right leading-6 line-clamp-2 tracking-tight">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="text-sm leading-[22px] text-muted-foreground text-right font-medium line-clamp-3">
          {post.excerpt}
        </p>
      )}

      <span className="text-xs text-muted-foreground text-right mt-1 font-semibold">
        {formatDate(post.date)}
      </span>
    </Link>
  );
}
