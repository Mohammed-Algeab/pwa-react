// components/CopyLinkButton.tsx
import { Link2, Check } from 'lucide-react';
import { useCopyLink } from '@/hooks/useCopyLink';

interface CopyLinkButtonProps {
  className?: string;
  /** رابط /share/ النظيف (بدون hash/app prefix) — إن لم يُمرَّر، يُنسخ window.location.href. */
  shareUrl?: string;
}

export function CopyLinkButton({ className = '', shareUrl }: CopyLinkButtonProps) {
  const { copied, copy } = useCopyLink(shareUrl);

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? 'تم النسخ!' : 'نسخ الرابط'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-bronze text-sm font-[family-name:var(--font-cairo)] transition-all duration-200 ${
        copied ? 'bg-success text-white' : 'bg-bronze/10 text-bronze'
      } ${className}`}
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
      <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
    </button>
  );
}
