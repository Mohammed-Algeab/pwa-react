// pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-5 text-center">
      <h1 className="text-xl font-bold text-text">هذه الصفحة غير موجودة</h1>
      <Link to="/" className="text-bronze font-semibold py-3">
        العودة للرئيسية
      </Link>
    </div>
  );
}
