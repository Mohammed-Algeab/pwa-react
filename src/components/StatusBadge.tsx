// components/StatusBadge.tsx
import type { Project } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  active: 'جاري العمل',
  completed: 'مكتمل',
  upcoming: 'قادم قريباً',
  paused: 'متوقف',
};

// ponytail: نفس قيم team-apk/constants/colors.ts (statusActive/Completed/...)
// — لا تُعرَّف كـTailwind theme لأنها استخدام محدود (هنا فقط)، فالقيمة
// مباشرة هنا أوضح من إضافة 4 ألوان عامة للنظام لاستخدام واحد.
const STATUS_COLORS: Record<string, string> = {
  active: 'rgba(200,168,112,0.92)',
  completed: 'rgba(80,200,120,0.92)',
  upcoming: 'rgba(96,144,192,0.92)',
  paused: 'rgba(220,80,60,0.92)',
};

export function StatusBadge({ status }: { status: Project['status'] | string }) {
  const bg = STATUS_COLORS[status] || STATUS_COLORS.active;
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className="inline-block px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide text-[#0E0C0A]"
      style={{ backgroundColor: bg, boxShadow: `0 3px 6px 0 ${bg}` }}
    >
      {label}
    </span>
  );
}
