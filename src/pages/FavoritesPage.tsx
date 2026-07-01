// pages/FavoritesPage.tsx
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { useProjects } from '@/hooks/queries/useProjects';
import { usePosts } from '@/hooks/queries/usePosts';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Project, Post } from '@/types';

export function FavoritesPage() {
  const { data: projects = [] } = useProjects();
  const { data: posts = [] } = usePosts();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const favoriteProjects = projects.filter((p: Project) => isFavorite(p.id));
  const favoritePosts = posts.filter((p: Post) => isFavorite(p.id));

  const items = [
    ...favoriteProjects.map((p) => ({ type: 'project' as const, data: p })),
    ...favoritePosts.map((p) => ({ type: 'post' as const, data: p })),
  ];

  return (
    <div className="max-w-2xl mx-auto pt-5 md:pt-10 pb-10">
      <div className="px-5 pb-4 border-b border-border">
        <h1 className="text-xl font-extrabold text-text text-right font-[family-name:var(--font-cairo)]">
          المفضلة
        </h1>
      </div>

      {favorites.length === 0 ? (
        <EmptyState icon={Heart} description="لا توجد عناصر في المفضلة" />
      ) : (
        <div className="p-4 flex flex-col gap-2">
          {items.map((item) => (
            <div key={`${item.type}-${item.data.id}`} className="flex flex-row-reverse items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
              <Link
                to={item.type === 'project' ? `/project/${item.data.id}` : `/post/${item.data.id}`}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-text text-right truncate">
                  {item.type === 'project' ? (item.data as Project).title || (item.data as Project).name : (item.data as Post).title}
                </p>
                <p className="text-xs text-muted-foreground text-right mt-0.5">
                  {item.type === 'project' ? 'مشروع' : 'منشور'}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => toggleFavorite(item.data.id)}
                aria-label="إزالة من المفضّلة"
                className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
              >
                <Heart size={20} className="fill-destructive text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
