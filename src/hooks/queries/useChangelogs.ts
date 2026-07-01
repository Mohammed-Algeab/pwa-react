import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { ChangelogItem } from '@/types';

export function useChangelogs() {
  return useQuery({
    queryKey: ['changelogs'],
    queryFn: () => supabaseQuery<ChangelogItem>('changelogs', 'order=created_at.desc'),
  });
}
