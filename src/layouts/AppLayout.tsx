// layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { BottomTabs } from '@/components/BottomTabs';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background text-text" dir="rtl">
      <Sidebar />
      {/* pb-20: يمنع اختفاء آخر عنصر بالمحتوى خلف BottomTabs الثابت على
          الهاتف. md:pb-0 يلغيها على الكمبيوتر حيث لا يوجد شريط سفلي أصلاً.
          paddingTop safe-area: نفس منطق BottomTabs (env(safe-area-inset-bottom))
          لكن للأعلى — مصدر واحد هنا بدل تعديل pt-4/pt-5 بكل صفحة على حدة.
          md:pt-0 يلغيها على الكمبيوتر (Sidebar بلا notch). */}
      <main
        className="flex-1 min-w-0 pb-20 md:pb-0 md:!pt-0"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Outlet />
      </main>
      <BottomTabs />
    </div>
  );
}
