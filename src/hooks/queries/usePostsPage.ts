// hooks/queries/usePostsPage.ts
// ponytail: منفصل عن usePosts() عمداً — usePosts() يبقى يجلب الكل للاستخدامات
// التي تحتاج كل العناصر محلياً (favorites, post/[id], الرئيسية). هذا الـhook
// فقط لصفحة التصفح الطويلة (BlogPage) حيث "تحميل المزيد" منطقي وموفّر لحمل
// الشبكة الأولي. (منقول حرفياً من team-apk/hooks/queries/usePostsPage.ts)
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { Post } from '@/types';

const PAGE_SIZE = 20;

export function usePostsPage() {
  return useInfiniteQuery({
    queryKey: ['posts-page'],
    queryFn: ({ pageParam = 0 }) =>
      supabaseQuery<Post>('posts', 'order=date.desc', [pageParam, pageParam + PAGE_SIZE - 1]),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
  });
}
