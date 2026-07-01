// hooks/useDiffAware.ts
// ponytail: يمنع "قفز" المحتوى تلقائياً تحت المستخدم وهو يقرأ لما توصل
// بيانات أحدث بالخلفية (refetchOnWindowFocus، أو stale-while-revalidate
// بالـService Worker). بدل استبدال الشاشة فوراً بأي بيانات جديدة توصل،
// يحتفظ بنسخة "معتمدة" (pinned) هي وحدها المعروضة، ويكتشف فقط إن كان فيه
// فرق فعلي (مقارنة محتوى حقيقية، مو مجرد "مرّ وقت") عن آخر بيانات وصلت.
// التطبيق الفعلي للتحديث (استبدال pinned) يصير فقط لما المستخدم يضغط زر
// "تحديث" بنفسه — بلا أي طلب شبكة إضافي، البيانات وصلت أصلاً وجاهزة.
import { useEffect, useRef, useState } from 'react';

interface DiffAwareSource<T> {
  data: T | undefined;
}

export function useDiffAware<T>(source: DiffAwareSource<T>) {
  const [pinned, setPinned] = useState<T | undefined>(undefined);
  const [hasUpdate, setHasUpdate] = useState(false);
  const pinnedSignature = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (source.data === undefined) return;
    const signature = JSON.stringify(source.data);

    if (pinnedSignature.current === undefined) {
      // أول وصول للبيانات (فتح التطبيق لأول مرة) — تُعتمد مباشرة بلا بانر
      pinnedSignature.current = signature;
      setPinned(source.data);
      return;
    }

    if (signature !== pinnedSignature.current) {
      setHasUpdate(true);
    }
  }, [source.data]);

  function applyUpdate() {
    if (source.data === undefined) return;
    pinnedSignature.current = JSON.stringify(source.data);
    setPinned(source.data);
    setHasUpdate(false);
  }

  return { data: pinned, hasUpdate, applyUpdate };
}
