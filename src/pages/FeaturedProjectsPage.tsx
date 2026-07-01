// pages/FeaturedProjectsPage.tsx
// ponytail: منقول من web/src/pages/FeaturedProjectsPage.tsx — نفس سبب غياب
// ContactPage عن النقل الأول (لم تكن موجودة بـteam-apk أصلاً).
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectCard } from '@/components/ProjectCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useProjects } from '@/hooks/queries/useProjects';

export function FeaturedProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();

  if (isLoading) return <LoadingScreen />;

  const featuredProjects = projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="max-w-5xl mx-auto pt-20 md:pt-10 pb-16 px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm mb-6 text-muted-foreground hover:text-bronze transition-colors">
        <ArrowRight size={16} />
        <span>العودة للرئيسية</span>
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-bronze font-[family-name:var(--font-cairo)]">
        المشاريع المميزة
      </h1>

      {featuredProjects.length === 0 ? (
        <p className="text-center py-16 text-muted-foreground">لا توجد مشاريع مميزة حالياً</p>
      ) : (
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
