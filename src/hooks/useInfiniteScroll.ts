// hooks/useInfiniteScroll.ts
// ponytail: معادل الويب لـonEndReached في FlatList — IntersectionObserver
// يرصد عنصر "حارس" (sentinel) بنهاية القائمة، ويستدعي onIntersect عند
// اقترابه من منطقة الرؤية (rootMargin يحقق نفس أثر onEndReachedThreshold).
import { useEffect, useRef } from 'react';

export function useInfiniteScrollSentinel(onIntersect: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}
