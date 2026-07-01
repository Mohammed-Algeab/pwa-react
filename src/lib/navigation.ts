// lib/navigation.ts
// ponytail: مصدر واحد لعناصر التنقل الأساسية — يُستخدم من BottomTabs (هاتف)
// وSidebar (كمبيوتر) كلاهما، فإضافة/تعديل تبويب يحصل بمكان واحد فقط.
// الأسماء والترتيب مطابقون تماماً لـteam-apk/app/(tabs)/_layout.tsx.
import { Home, LayoutGrid, BookOpen, Download, MoreHorizontal } from 'lucide-react';
import type { ComponentType } from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/projects', label: 'المشاريع', icon: LayoutGrid },
  { path: '/blog', label: 'المدونة', icon: BookOpen },
  { path: '/downloads', label: 'التحميلات', icon: Download },
  { path: '/more', label: 'المزيد', icon: MoreHorizontal },
];
