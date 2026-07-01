import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// ponytail: base: '/' — هذا الـPWA أصبح موقعاً مستقلاً تماماً بدومين/مسار
// نشر خاص به (وليس تحت /app/ من موقع web). القرار السابق (موقعان داخل موقع
// واحد عبر /app/) كان يسبب تعقيداً غير ضروري في الاستضافة (Cloudflare
// _redirects، تعارض BrowserRouter مع الموقع الرئيسي، 404 عند reload على
// استضافات لا تدعم SPA rewrite مثل GitHub Pages أو خادم تطوير محلي بسيط).
// الآن: web هو الموقع الرئيسي وحده، وهذا الـPWA يُنشر بشكل منفصل تماماً على
// رابطه الخاص، وweb يوجّه زر "حمّل التطبيق" لذلك الرابط مباشرة (راجع
// web/src/lib/pwaUrl.ts).
const BASE_PATH = '/'

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // ponytail: 'autoUpdate' يحدّث الـService Worker تلقائياً بالخلفية دون
      // مطالبة المستخدم — مناسب لموقع محتواه (مشاريع/منشورات) يتغيّر بانتظام
      // ولا حاجة لمطالبته "حدّث الآن" كل مرة. التحديث يُطبَّق بإعادة التحميل
      // التالية تلقائياً.
      registerType: 'autoUpdate',
      scope: BASE_PATH,
      base: BASE_PATH,
      includeAssets: ['favicon.svg', 'images/**/*'],
      manifest: {
        id: BASE_PATH,
        name: 'فريق ألفا للتعريب',
        short_name: 'ألفا',
        description: 'نُعرِّب الألعاب والروايات البصرية إلى اللغة العربية',
        // ponytail: هوية الفريق — أسود دافئ + برونزي (راجع index.css لنفس القيم)
        theme_color: '#0E0C0A',
        background_color: '#0E0C0A',
        display: 'standalone',
        // ponytail: orientation:'portrait-primary' كان يقفل التطبيق بوضع
        // عمودي ثابت — منطقي للموبايل وحده، لكنه يرسل إشارة "تطبيق موبايل
        // فقط" تجعل بعض المتصفحات (تحديداً عند التثبيت على Windows/macOS)
        // تتعامل مع نافذة التطبيق بشكل غير طبيعي لشاشة حاسوب (نافذة ضيقة
        // عمودية، تجاهل تكبير الشاشة بسلاسة). التطبيق مصمم ليعمل جيداً على
        // PC أيضاً (راجع Sidebar.tsx)، فحذف هذا القيد يترك الاتجاه يتبع
        // حجم النافذة الفعلي بدل افتراض عمودي دائماً.
        dir: 'rtl',
        lang: 'ar',
        scope: BASE_PATH,
        start_url: BASE_PATH,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // ponytail: نطاق هذا الـService Worker هو جذر دومين هذا المشروع
        // المستقل (نفس scope أعلاه) — لا علاقة له بدومين/استضافة موقع web
        // الرئيسي، فلا تعارض ممكن بين الاثنين بعد الآن.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            // بيانات Supabase REST (مشاريع/منشورات) — يجب أن تسبق قاعدة
            // الأصول بالأسفل. Workbox يطبّق أول قاعدة تطابق الرابط فقط
            // بالترتيب، وبما أن REST API أيضاً على دومين *.supabase.co،
            // كانت تقع خطأً تحت CacheFirst (الأصول) فتتجمد بيانات المشاريع
            // على أول نسخة لمدة 30 يوم كاملة — لا تُحدَّث حتى لو تغيّرت
            // فعلياً بـSupabase. الترتيب هنا هو الإصلاح، والشرط الصريح
            // (url.pathname.startsWith('/rest/')) بقاعدة الأصول تحت هو
            // حماية إضافية تمنع تكرار نفس الخطأ لو تغيّر الترتيب لاحقاً.
            urlPattern: ({ url }) =>
              url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/rest/'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'supabase-api' },
          },
          {
            // صور المشاريع/الأغلفة من Supabase Storage — تُخزَّن بعد أول
            // طلب، فتبقى متاحة عند فقدان الاتصال لاحقاً. مستثنى صراحة مسار
            // /rest/ فلا يبتلع بيانات REST حتى لو تغيّر ترتيب المصفوفة.
            urlPattern: ({ url }) =>
              url.hostname.endsWith('.supabase.co') && !url.pathname.startsWith('/rest/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-assets',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // يفعّل الـService Worker حتى أثناء "vite dev" للمعاينة السريعة —
        // عادة PWA لا تعمل إلا بعد build، هذا يسهّل تطويرها يومياً.
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
  },
})
