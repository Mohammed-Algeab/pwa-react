import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { Project } from '@/types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => supabaseQuery<Project>('projects'),
  });
}
