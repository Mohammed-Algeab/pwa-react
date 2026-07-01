// lib/assetUrl.ts
// ponytail: منقول من web/src/lib/assetUrl.ts. عامة بغض النظر عن قيمة base
// (حالياً '/' بما أن هذا المشروع مستقل، راجع vite.config.ts) — تبقى مفيدة
// إن تغيّر مسار النشر مستقبلاً (مثلاً تحت مجلد فرعي بدومين معيّن) دون أي
// تعديل بالكود الذي يستدعيها.
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL; // '/' بحالتنا دائماً، لكن الدالة عامة
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
