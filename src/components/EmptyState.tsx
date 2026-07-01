// components/EmptyState.tsx
import { Inbox, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  /** alias قديم — بعض الصفحات تمرر message بدل description (نفس team-apk) */
  message?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, message }: EmptyStateProps) {
  const desc = description ?? message;
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-10 py-16 gap-[18px] text-center">
      <div className="w-[90px] h-[90px] rounded-[24px] border-[1.5px] border-border bg-accent flex items-center justify-center">
        <Icon size={56} className="text-bronze" />
      </div>
      {title && <h3 className="text-lg font-extrabold text-text tracking-tight">{title}</h3>}
      {desc && <p className="text-sm leading-[22px] font-medium text-muted-foreground max-w-xs">{desc}</p>}
    </div>
  );
}
