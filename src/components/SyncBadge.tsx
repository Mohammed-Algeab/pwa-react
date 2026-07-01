// components/SyncBadge.tsx
// ponytail: صغير وغير متطفّل — يظهر فقط حين تكون البيانات غير حديثة أو
// قيد التحديث الآن، مهم خصوصاً في PWA يعمل أوفلاين (يوضّح للزائر أن ما
// يراه قد يكون نسخة محفوظة سابقاً وليست أحدث بيانات).
import { Info } from 'lucide-react';

interface SyncBadgeProps {
  isFetching: boolean;
  isStale?: boolean;
  dataUpdatedAt?: number;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
}

export function SyncBadge({ isFetching, isStale, dataUpdatedAt }: SyncBadgeProps) {
  if (!isFetching && !isStale) return null;

  const lastUpdate = dataUpdatedAt
    ? `آخر تحديث: ${formatRelativeTime(dataUpdatedAt)}`
    : 'بيانات محفوظة — قد تكون غير محدثة';

  return (
    <div className="flex flex-row-reverse items-center gap-1.5 px-4 py-1 opacity-60">
      <Info size={14} className="text-muted-foreground" />
      <span className="text-[11px] text-muted-foreground font-[family-name:var(--font-cairo)]">
        {isFetching ? 'جاري التحديث...' : lastUpdate}
      </span>
    </div>
  );
}
