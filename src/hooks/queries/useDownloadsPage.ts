// hooks/queries/useDownloadsPage.ts
// ponytail: يطابق web/src/hooks/useData.ts (PAGE_SIZE=20 لـdownloads) —
// اكتُشف أن web يستخدم تحميلاً تدريجياً لجدول downloads (قد يكبر بلا حد)،
// بخلاف نسخة team-apk التي كانت تجلب الكل دفعة واحدة. نفس نمط usePostsPage.
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabaseDownloadsWithChangelog } from '@/lib/supabase';
import type { Download } from '@/types';

const PAGE_SIZE = 20;

export function useDownloadsPage() {
  return useInfiniteQuery({
    queryKey: ['downloads-page'],
    queryFn: ({ pageParam = 0 }) =>
      supabaseDownloadsWithChangelog<Download>([pageParam, pageParam + PAGE_SIZE - 1]),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
  });
}
