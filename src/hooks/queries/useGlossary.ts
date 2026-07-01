import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { GlossaryItem } from '@/types';

export function useGlossary() {
  return useQuery({
    queryKey: ['glossary'],
    queryFn: () => supabaseQuery<GlossaryItem>('glossary'),
  });
}
