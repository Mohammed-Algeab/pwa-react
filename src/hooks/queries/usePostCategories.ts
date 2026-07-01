import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { PostCategory } from '@/types';

export function usePostCategories() {
  return useQuery({
    queryKey: ['postCategories'],
    queryFn: () => supabaseQuery<PostCategory>('post_categories', 'order=display_order.asc'),
  });
}
