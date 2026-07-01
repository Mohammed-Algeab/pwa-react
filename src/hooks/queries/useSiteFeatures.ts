import { useQuery } from '@tanstack/react-query';
import { supabaseQuery } from '@/lib/supabase';
import type { SiteFeatures } from '@/types';

export function useSiteFeatures() {
  return useQuery({
    queryKey: ['siteFeatures'],
    queryFn: async (): Promise<SiteFeatures> => {
      const data = await supabaseQuery<{ key: string; enabled: boolean }>(
        'site_features',
        'select=key,enabled'
      );
      return Object.fromEntries(data.map((f) => [f.key, f.enabled]));
    },
  });
}
