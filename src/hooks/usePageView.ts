// hooks/usePageView.ts
// ponytail: منقول من team-apk — يسجّل مشاهدة واحدة لكل (محتوى+جهاز) باليوم،
// معتمداً على UNIQUE constraint بقاعدة البيانات (Prefer: resolution=ignore-
// duplicates) بدل منطق تكرار من جهة العميل.
import { useEffect, useRef } from 'react';
import { getVisitorHash } from '@/hooks/useVisitorHash';

const BASE = import.meta.env.VITE_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export type ContentType = 'project' | 'post' | 'download';

async function recordPageView(contentType: ContentType, contentId: string) {
  try {
    const visitorHash = getVisitorHash();
    await fetch(`${BASE}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates',
      },
      body: JSON.stringify({
        content_type: contentType,
        content_id: contentId,
        visitor_hash: visitorHash,
        viewed_at: new Date().toISOString().split('T')[0],
      }),
    });
  } catch {
    // التحليلات ليست حرجة — فشل صامت لا يجب أن يؤثر على تجربة المستخدم
  }
}

export function usePageView(contentType: ContentType, contentId: string | undefined) {
  const recorded = useRef<string | null>(null);

  useEffect(() => {
    if (!contentId || recorded.current === contentId) return;
    recorded.current = contentId;
    recordPageView(contentType, contentId);
  }, [contentType, contentId]);
}
