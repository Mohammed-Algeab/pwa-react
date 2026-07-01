// App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { BlogPage } from '@/pages/BlogPage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { DownloadsPage } from '@/pages/DownloadsPage';
import { VersionsPage } from '@/pages/VersionsPage';
import { MorePage } from '@/pages/MorePage';
import { AboutPage } from '@/pages/AboutPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { IndependentPage } from '@/pages/IndependentPage';
import { GlossaryPage } from '@/pages/GlossaryPage';
import { FAQPage } from '@/pages/FAQPage';
import { JoinPage } from '@/pages/JoinPage';
import { ContactPage } from '@/pages/ContactPage';
import { FeaturedProjectsPage } from '@/pages/FeaturedProjectsPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SearchPage } from '@/pages/SearchPage';
import { InstallPage } from '@/pages/InstallPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// ponytail: HashRouter بدل BrowserRouter — هذا الموقع أصبح مستقلاً تماماً
// (base: '/' في vite.config.ts، بدون basename). المشكلة التي كانت موجودة
// مع BrowserRouter: أي مسار غير الجذر (مثلاً /install) هو URL حقيقي يطلبه
// المتصفح من الخادم مباشرة عند reload أو فتح رابط مباشر — فإن لم يكن
// الخادم مهيّأ بقاعدة "SPA fallback" (rewrite كل مسار إلى index.html)، يرجع
// 404 حقيقي لأن لا يوجد فعلياً مجلد/ملف باسم "install" على القرص. هذا بالضبط
// ما يحدث على استضافات لا تدعم هذا الإعداد افتراضياً (GitHub Pages بدون
// إعداد خاص، أو أي خادم تطوير محلي بسيط مثل python -m http.server).
// HashRouter يحل المشكلة جذرياً: المسار (#/install) يعيش بالكامل بعد الـ#،
// وهذا الجزء لا يُرسَل للخادم إطلاقاً (خاصية أساسية في بروتوكول HTTP) —
// الخادم يرى فقط طلب index.html دائماً، بغض النظر عن الصفحة. لا حاجة لأي
// إعداد خادم خاص بعد الآن، يعمل على أي استضافة ثابتة بدون استثناء. نفس
// النهج المستخدم في مشروع web (راجع web/src/main.tsx).
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="project/:id" element={<ProjectDetailPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="post/:id" element={<PostDetailPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="versions/:id" element={<VersionsPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="independent" element={<IndependentPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="join" element={<JoinPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="featured" element={<FeaturedProjectsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="install" element={<InstallPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
