import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { TeamMember } from '@/types';

export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: () => supabaseQuery<TeamMember>('team'),
  });
}
