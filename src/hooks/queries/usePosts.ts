import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { Post } from '@/types';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => supabaseQuery<Post>('posts', 'order=date.desc'),
  });
}
