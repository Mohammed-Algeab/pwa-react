import { useQuery } from '@tanstack/react-query';
import { supabaseSingle } from '@/lib/supabase';
import type { Settings } from '@/types';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => supabaseSingle<Settings>('settings', 'id=eq.1'),
  });
}
