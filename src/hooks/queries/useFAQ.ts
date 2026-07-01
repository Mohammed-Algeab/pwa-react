import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { FAQItem } from '@/types';

export function useFAQ() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: () => supabaseQuery<FAQItem>('faq', 'order=order.asc'),
  });
}
