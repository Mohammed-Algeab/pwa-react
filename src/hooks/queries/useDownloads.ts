// hooks/queries/useDownloads.ts
// ponytail: يتعايش مع useDownloadsPage (الترقيم التدريجي، لصفحة /downloads
// المستقلة فقط). هذا الهوك يجلب كل التحميلات دفعة واحدة — مطلوب من
// ProjectDetailPage وVersionsPage، اللتين تحتاجان كل تحميلات مشروع واحد
// بالذات وليس صفحة جزئية من الكل. حذف هذا الملف بمرحلة سابقة (أثناء استبدال
// DownloadsPage) كسر الصفحتين دون قصد — أُعيد إنشاؤه بعد فحص الاعتمادية.
import { useQuery } from '@tanstack/react-query';
import { supabaseDownloadsWithChangelog } from '@/lib/supabase';
import type { Download } from '@/types';

export function useDownloads() {
  return useQuery({
    queryKey: ['downloads'],
    queryFn: () => supabaseDownloadsWithChangelog<Download>(),
  });
}
