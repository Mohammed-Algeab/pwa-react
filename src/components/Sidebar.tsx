// components/Sidebar.tsx
// ponytail: على الكمبيوتر، شريط سفلي بعرض 1920px يصير ضيقاً وغريباً وسط
// شاشة فاضية (لاحظنا هذا تحديداً بنقاش التصميم) — Sidebar جانبي بعرض ثابت
// يستخدم الفراغ الأفقي المتاح بشكل طبيعي أكثر، ويسمح بنص واضح بجانب كل
// أيقونة بدل تسمية مصغّرة تحت أيقونة صغيرة.
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/lib/navigation';

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 border-l border-border bg-card">
      <div className="px-6 py-7 border-b border-border">
        <span className="font-[family-name:var(--font-cairo)] text-xl font-black text-bronze">
          فريق ألفا
        </span>
        <p className="text-xs text-muted-foreground mt-1">للتعريب</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-bronze/10 text-bronze'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              ].join(' ')
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
