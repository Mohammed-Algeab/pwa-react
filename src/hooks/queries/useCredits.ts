import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { CreditItem } from '@/types';

export function useCredits() {
  return useQuery({
    queryKey: ['credits'],
    queryFn: () => supabaseQuery<CreditItem>('credits'),
  });
}
