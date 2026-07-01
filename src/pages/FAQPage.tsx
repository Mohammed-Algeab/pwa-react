// pages/FAQPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { SyncBadge } from '@/components/SyncBadge';
import { useFAQ } from '@/hooks/queries/useFAQ';
import { useSiteFeatures } from '@/hooks/queries/useSiteFeatures';
import type { FAQItem } from '@/types';

function FAQCard({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border bg-card overflow-hidden ${open ? 'border-bronze/30' : 'border-border'}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4"
      >
        {open ? (
          <ChevronUp size={18} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-muted-foreground shrink-0" />
        )}
        <span className="flex-1 text-[15px] font-semibold text-text text-right leading-[22px]">
          {item.question}
        </span>
      </button>
      {open && (
        <div className="border-t border-border p-4">
          <p className="text-sm leading-[22px] text-muted-foreground text-right">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQPage() {
  const navigate = useNavigate();
  const { data: faq = [], isLoading: faqLoading, isFetching, isStale, dataUpdatedAt } = useFAQ();
  const { data: siteFeatures = {}, isLoading: featuresLoading } = useSiteFeatures();
  const loading = faqLoading || featuresLoading;

  useEffect(() => {
    if (!loading && !siteFeatures.faq_page) {
      navigate('/', { replace: true });
    }
  }, [loading, siteFeatures.faq_page, navigate]);

  if (loading || !siteFeatures.faq_page) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto pt-20 md:pt-10 pb-10 px-4">
      <SyncBadge isFetching={isFetching} isStale={isStale} dataUpdatedAt={dataUpdatedAt} />

      <div className="flex flex-col items-end gap-2 mb-6">
        <p className="text-xs font-bold tracking-widest text-bronze">— مشاركاتنا</p>
        <h1 className="text-[26px] font-black text-text text-right font-[family-name:var(--font-cairo)]">
          {'الأسئلة '}
          <span className="text-bronze">الشائعة</span>
        </h1>
        <p className="text-sm leading-[22px] text-muted-foreground text-right">
          أجوبة على الأسئلة الأكثر شيوعاً حول فريق ألفا ومشاريعه
        </p>
      </div>

      {faq.length === 0 ? (
        <EmptyState icon={HelpCircle} title="لا توجد أسئلة" />
      ) : (
        <div className="flex flex-col gap-2.5">
          {faq.map((item: FAQItem) => (
            <FAQCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
