// pages/MorePage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Map,
  Globe,
  HelpCircle,
  BookOpen,
  UserPlus,
  Send,
  MessageCircle,
  Heart,
  Settings as SettingsIcon,
  Download,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/queries/useSiteSettings';
import { useProjects } from '@/hooks/queries/useProjects';
import { useGlossary } from '@/hooks/queries/useGlossary';
import { useFAQ } from '@/hooks/queries/useFAQ';
import { useIndependent } from '@/hooks/queries/useIndependent';
import { useSiteFeatures } from '@/hooks/queries/useSiteFeatures';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  route?: string;
  external?: string;
  badge?: string;
}

function MenuRow({ item }: { item: MenuItem }) {
  const inner = (
    <>
      <ChevronLeft size={16} className="text-muted-foreground" />
      <div className="flex-1 flex flex-row-reverse items-center gap-2.5">
        {item.badge && (
          <span className="px-2 py-0.5 rounded-full border border-bronze/20 bg-bronze/[0.12] text-[11px] font-semibold text-bronze">
            {item.badge}
          </span>
        )}
        <span className="flex-1 text-[15px] font-semibold text-text text-right">{item.label}</span>
        <div className="w-9 h-9 rounded-[10px] bg-bronze/[0.08] flex items-center justify-center shrink-0">
          <item.icon size={18} className="text-bronze" />
        </div>
      </div>
    </>
  );

  const className = 'flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors';

  return item.route ? (
    <Link to={item.route} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={item.external} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  );
}

export function MorePage() {
  const { data: settings } = useSiteSettings();
  const { data: projects = [] } = useProjects();
  const { data: glossary = [] } = useGlossary();
  const { data: faq = [] } = useFAQ();
  const { data: independent = [] } = useIndependent();
  const { data: siteFeatures = {} } = useSiteFeatures();

  // ponytail: لا نعرض "حمّل التطبيق" إن كان المستخدم يتصفح بالفعل من
  // داخل التطبيق المثبَّت (display-mode: standalone) — لا فائدة من دعوته
  // لتثبيت شيء يستخدمه حالياً.
  const [isStandalone, setIsStandalone] = useState(true); // افتراضي true لمنع وميض قبل الفحص
  useEffect(() => {
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  }, []);

  const sections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'المحتوى',
      items: [
        { label: 'عن الفريق', icon: Users, route: '/about' },
        { label: 'خارطة الطريق', icon: Map, route: '/roadmap', badge: String(projects.length) },
        { label: 'تعريبات مستقلة', icon: Globe, route: '/independent', badge: String(independent.length) },
        ...(siteFeatures.faq_page
          ? [{ label: 'الأسئلة الشائعة', icon: HelpCircle, route: '/faq', badge: String(faq.length) }]
          : []),
        { label: 'قاموس التعريب', icon: BookOpen, route: '/glossary', badge: String(glossary.length) },
      ],
    },
    {
      title: 'المجتمع',
      items: [
        ...(siteFeatures.join_team_page ? [{ label: 'انضم للفريق', icon: UserPlus, route: '/join' }] : []),
        ...(settings?.telegram_channel
          ? [{ label: 'قناة التيليغرام', icon: Send, external: settings.telegram_channel }]
          : []),
        ...(settings?.telegram_group
          ? [{ label: 'مجموعة التيليغرام', icon: MessageCircle, external: settings.telegram_group }]
          : []),
      ],
    },
    {
      title: 'الحساب',
      items: [
        ...(!isStandalone ? [{ label: 'حمّل التطبيق', icon: Download, route: '/install' }] : []),
        { label: 'المفضلة', icon: Heart, route: '/favorites' },
        { label: 'الإعدادات', icon: SettingsIcon, route: '/settings' },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto pt-5 md:pt-10 pb-10">
      <div className="px-5 pb-6 flex flex-col items-end gap-1.5">
        <h1 className="text-[30px] font-black text-text font-[family-name:var(--font-cairo)]">
          {'فريق '}
          <span className="text-bronze">ألفا</span>
        </h1>
        <p className="text-sm text-muted-foreground text-right">{settings?.tagline || 'نُعرِّب ما تحبه'}</p>
      </div>

      {sections.map(
        (section) =>
          section.items.length > 0 && (
            <div key={section.title} className="px-4 mb-6 flex flex-col gap-2.5">
              <p className="text-xs font-bold tracking-wide text-bronze text-right px-1">{section.title}</p>
              <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                {section.items.map((item) => (
                  <MenuRow key={item.label} item={item} />
                ))}
              </div>
            </div>
          )
      )}

      <p className="text-center text-xs text-muted-foreground pt-1 pb-5">
        {settings?.site_name || 'فريق ألفا للتعريب'}
      </p>
    </div>
  );
}
