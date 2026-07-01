// components/ProjectCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Project } from '@/types';

export function ProjectCard({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const favored = isFavorite(project.id);
  const progressColorClass = project.status === 'completed' ? 'bg-success' : 'bg-bronze';
  const progressTextColorClass = project.status === 'completed' ? 'text-success' : 'text-bronze';

  return (
    <Link
      to={`/project/${project.id}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-44">
        {!imgError && project.cover ? (
          <img
            src={project.cover}
            alt={project.title || project.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          /* ponytail: بطاقات بلا غلاف كانت تبدو كمساحة سوداء/بيضاء فاضية
             تماماً. الحرف الأول من الاسم كـ visual anchor يوضح أن الغلاف
             غير متاح بدل الوهم بأن الصورة فشلت في التحميل. */
          <div className="w-full h-full bg-accent flex items-center justify-center">
            <span className="text-5xl font-black text-bronze/25 select-none font-[family-name:var(--font-cairo)]">
              {(project.title || project.name || '؟').charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3">
          <StatusBadge status={project.status} />
        </div>

        <button
          type="button"
          aria-label={favored ? 'إزالة من المفضّلة' : 'إضافة للمفضّلة'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(project.id);
          }}
          className="absolute bottom-3 left-3 w-11 h-11 rounded-[10px] flex items-center justify-center bg-black/65 backdrop-blur-sm"
        >
          <Heart
            size={18}
            className={favored ? 'fill-destructive text-destructive' : 'text-[#F5F0E8]'}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2.5">
        <h3 className="text-base font-extrabold text-text text-right line-clamp-2 tracking-tight">
          {project.title || project.name}
        </h3>
        <p className="text-[13px] leading-5 text-muted-foreground text-right font-medium line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-col gap-2.5 mt-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className={`h-full rounded-full ${progressColorClass}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className={`text-[13px] font-extrabold min-w-10 text-right ${progressTextColorClass}`}>
              {project.progress}%
            </span>
          </div>
          <div className="flex flex-row-reverse items-center gap-2.5">
            <span className="text-xs font-bold border-[1.5px] border-border text-muted-foreground rounded-full px-2.5 py-1">
              {project.type}
            </span>
            {project.latest_version && (
              <span className="text-xs font-semibold text-muted-foreground">
                {project.latest_version}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
