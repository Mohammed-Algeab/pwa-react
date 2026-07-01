// components/BottomTabs.tsx
// ponytail: يظهر فقط تحت md (نفس نقطة التحول التي يختفي عندها Sidebar) —
// النسختان لا تتعايشان أبداً بنفس اللحظة، فلا تكرار في عناصر التنقل.
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/lib/navigation';

export function BottomTabs() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch justify-between px-2">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-bronze' : 'text-muted-foreground',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} className={isActive ? 'fill-bronze/10' : ''} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
