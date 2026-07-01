import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { Independent } from '@/types';

export function useIndependent() {
  return useQuery({
    queryKey: ['independent'],
    queryFn: () => supabaseQuery<Independent>('independent', 'order=date.desc'),
  });
}
