// components/GiscusComments.tsx
// ponytail: منقول تقريباً حرفياً من web/src/components/GiscusComments.tsx —
// هذا بالضبط الفرق الجوهري الذي ناقشناه: بما أن PWA يعمل بمتصفح حقيقي (وليس
// React Native)، @giscus/react (المعتمد على iframe) يعمل مباشرة هنا بدون أي
// حاجة لـembed-comments.html / WebView كما كان مطلوباً في team-apk.
import Giscus from '@giscus/react';

interface GiscusCommentsProps {
  term: string;
  mapping?: 'specific' | 'pathname' | 'title';
  theme?: 'alpha-dark' | 'alpha-light';
}

// نفس مستودع/Discussion الموقع الرئيسي بالضبط — مصدر واحد للتعليقات بين
// web والـPWA (وليس نظامين منفصلين كما كان الحال مع team-apk سابقاً).
const GISCUS_CONFIG = {
  repo: 'Mohammed-Algeab/Alpha-Team' as `${string}/${string}`,
  repoId: 'R_kgDOTG207Q',
  category: 'Comments',
  categoryId: 'DIC_kwDOTG207c4DAAUY',
} as const;

// مصدره pwa/.env (VITE_SITE_URL) — يطابق نفس آلية مشروع web.
const PRODUCTION_ORIGIN = import.meta.env.VITE_SITE_URL as string;

// ponytail: مُستخدم الآن فقط لرابط ملف ثيم giscus (CSS حقيقي يُجلب من
// giscus.app خارجياً)، وليس للـterm بعد الآن (term أصبح id خام، راجع
// getGiscusTerm أسفل الملف). نبقيه منفصلاً عن PRODUCTION_ORIGIN (الذي يحمل
// /app) لأن ملف الثيم يُنشر فقط مع web الرئيسي، وليس مع الـPWA.
const SHARED_CONTENT_ORIGIN = (import.meta.env.VITE_SHARED_CONTENT_ORIGIN as string) || PRODUCTION_ORIGIN;

function resolveThemeUrl(theme: 'alpha-dark' | 'alpha-light'): string {
  const filename = theme === 'alpha-dark' ? 'alpha-dark.css' : 'alpha-light.css';
  const isLocalDev = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.)/.test(window.location.hostname);

  if (isLocalDev) {
    // giscus.app (خادم خارجي) لا يصل لـlocalhost أبداً — ثيم giscus المدمج
    // كـfallback أثناء التطوير المحلي فقط.
    return theme === 'alpha-dark' ? 'dark_dimmed' : 'light';
  }

  return `${SHARED_CONTENT_ORIGIN}/giscus/${filename}`;
}

export function GiscusComments({ term, mapping = 'specific', theme = 'alpha-dark' }: GiscusCommentsProps) {
  const themeValue = resolveThemeUrl(theme);

  return (
    <div className="mt-8 p-6 rounded-[14px] bg-card border border-bronze/[0.12]">
      <div className="mb-4 pb-3 border-b border-bronze/[0.08]">
        <h3 className="font-[family-name:var(--font-cairo)] text-[0.95rem] font-bold text-bronze m-0">
          التعليقات
        </h3>
        <p className="font-[family-name:var(--font-cairo)] text-xs text-muted-foreground mt-1 opacity-70">
          يتطلب حساب GitHub للتعليق · محفوظة داخل GitHub Discussions
        </p>
      </div>

      <Giscus
        id="giscus-comments"
        repo={GISCUS_CONFIG.repo}
        repoId={GISCUS_CONFIG.repoId}
        category={GISCUS_CONFIG.category}
        categoryId={GISCUS_CONFIG.categoryId}
        mapping={mapping}
        term={term}
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={themeValue}
        lang="ar"
        loading="lazy"
      />
    </div>
  );
}

// ponytail: term هو الآن فقط الـid الخام — لا رابط كامل. giscus يستخدمه
// كنص مطابقة فقط (data-mapping="specific")، وليس رابطاً يُفتح أو يُتحقق
// منه فعلياً، فلا حاجة يكون عنوان URL أصلاً. هذا يلغي بالكامل مشكلة تطابق
// web/PWA السابقة (اختلاف /app بالمسار) — الـid ثابت بغض النظر عن الدومين
// أو base path أو إعادة تسمية الموقع مستقبلاً.
export function getGiscusTerm(_type: 'project' | 'post', id: string): string {
  return id;
}

// ponytail: منفصلة تماماً عن getGiscusTerm — هذي لأغراض المشاركة الفعلية
// (زر نسخ الرابط، og:url لمعاينات واتساب/تيليجرام). تستخدم عمداً
// SHARED_CONTENT_ORIGIN (بدون /app) وليس PRODUCTION_ORIGIN: الـCloudflare
// Function الحقيقية المسؤولة عن معاينة OG (functions/share/projects/[id].js)
// موجودة فقط بمشروع web الرئيسي — لا يوجد مجلد functions/ مكرر تحت /app/
// بالـPWA (راجع DEVELOPER_LOG.md). رابط بـ/app/share/... لن يجد أي Function
// تستجيب له، فتنكسر معاينة OG بالكامل. الزائر سينتقل لاحقاً لصفحة المشروع
// الحقيقية بالموقع الرئيسي (web)، لا داخل الـPWA — وهذا متوقع ومقصود، لأن
// Function نفسها تُعيد التوجيه لرابط web (#/projects/{id})، لا لـPWA.
export function getShareUrl(type: 'project' | 'post', id: string): string {
  const segment = type === 'project' ? 'projects' : 'blog';
  return `${SHARED_CONTENT_ORIGIN}/share/${segment}/${id}`;
}
