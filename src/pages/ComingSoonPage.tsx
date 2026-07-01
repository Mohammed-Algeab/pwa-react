// pages/ComingSoonPage.tsx
// ponytail: مرحلة أولى تشمل فقط الصفحة الرئيسية + التنقل (حسب الاتفاق) —
// هذا placeholder مؤقت لباقي التبويبات حتى تُبنى كل صفحة بمرحلتها التالية،
// يسمح باختبار التنقل (Sidebar/BottomTabs) كاملاً منذ الآن.
export function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3 px-6 text-center">
      <h1 className="text-2xl font-black text-text font-[family-name:var(--font-cairo)]">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">قيد الإنشاء — المرحلة القادمة</p>
    </div>
  );
}
