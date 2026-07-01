// pages/InstallPage.tsx
// ponytail: صفحة مخصصة لشرح تثبيت الـ PWA كـ"تطبيق" على الهاتف.
// مسارها #/install — يُوجَّه إليها من البانر في موقع web عند الضغط على
// "كيف؟" (iOS) أو من قائمة "المزيد". لا تظهر في الـ BottomTabs (ليست
// وجهة متكررة) لكنها مسجّلة في Router لأنه لا يوجد deep link آخر يُوصلها.
//
// ponytail: نسخة سابقة قررت أي قسم يظهر (Android مقابل iOS) بشرطين
// متراكبين منفصلين (isAndroid || deferredPrompt) و(isIOS || (!isAndroid
// && !deferredPrompt)) — على سطح المكتب مع deferredPrompt موجوداً كان
// يظهر القسمان معاً، وحتى على Android نفسه كان زر "ثبّت الآن" يتبدّل
// بخطوات يدوية متى وصل/تأخر beforeinstallprompt (التوقيت غير موثوق:
// أحياناً يصل فوراً، أحياناً بعد تفاعل المستخدم، أحياناً لا يصل أبداً إن
// كان مثبّتاً سابقاً وأُزيل). هذا بالضبط ما رُصِد كـ"أحياناً تعليمات
// وأحياناً زر". الحل: حسم "platform" واحد عبر userAgent فقط (موثوق ١٠٠٪
// وثابت من أول رندر) يحدد القسم الظاهر بحصرية تامة. deferredPrompt الآن
// مجرد تحسين *داخل* قسم Android (بضغطة بدل خطوات يدوية إن وصل)، ولا
// يتحكم أبداً بأي قسم يظهر.
import { useState, useEffect } from 'react';
import { Download, Share, Plus, MoreVertical, CheckCircle2, Smartphone, Apple } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Platform = 'android' | 'ios' | 'desktop';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  return 'desktop';
}

export function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  // platform يُحسب مرة واحدة من userAgent (متاح فوراً، بلا انتظار أي حدث)
  // — هذا هو المصدر الوحيد لقرار "أي قسم يظهر"، فلا تذبذب لاحق ممكن.
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    setPlatform(detectPlatform());

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    // يُستخدم فقط كتحسين اختياري داخل قسم Android — لا يُغيّر أي قسم يظهر
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
    setInstalling(false);
  };

  return (
    <div className="max-w-lg mx-auto pt-20 md:pt-10 pb-16 px-4">

      {/* Header */}
      <div className="flex flex-col items-end gap-2.5 mb-8">
        <p className="text-xs font-bold tracking-widest text-bronze">— التطبيق</p>
        <h1 className="text-[28px] font-black text-text text-right leading-tight font-[family-name:var(--font-cairo)]">
          حمّل{' '}
          <span className="text-bronze">التطبيق</span>
        </h1>
        <p className="text-sm text-muted-foreground text-right leading-relaxed">
          ثبّت تطبيق فريق ألفا على هاتفك — سريع، يعمل أوفلاين، وبدون متجر تطبيقات.
        </p>
      </div>

      {/* حالة: مثبّت بالفعل */}
      {installed && (
        <div className="flex flex-row-reverse items-center gap-3 p-4 rounded-2xl border border-green-500/30 bg-green-500/[0.07] mb-6">
          <CheckCircle2 size={22} className="text-green-400 shrink-0" />
          <div className="text-right">
            <p className="text-sm font-bold text-text">التطبيق مثبّت ✓</p>
            <p className="text-xs text-muted-foreground">يمكنك فتحه مباشرة من شاشتك الرئيسية</p>
          </div>
        </div>
      )}

      {/* Android — قسم واحد حصري؛ المحتوى الداخلي فقط يتغيّر حسب
          deferredPrompt (زر مباشر إن توفر، وإلا خطوات يدوية بديلة) */}
      {!installed && platform === 'android' && (
        <div className="rounded-2xl border border-bronze/20 bg-card p-5 mb-5">
          <div className="flex flex-row-reverse items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-bronze/[0.12] flex items-center justify-center text-bronze shrink-0">
              <Smartphone size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-text">Android / Chrome</p>
              <p className="text-xs text-muted-foreground">تثبيت مباشر بضغطة واحدة</p>
            </div>
          </div>

          {deferredPrompt ? (
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] font-bold text-sm"
              style={{
                background: installing
                  ? 'rgba(var(--bronze-rgb),0.4)'
                  : 'linear-gradient(135deg, var(--color-bronze,#C8A870), var(--color-bronze-light,#DCC394))',
                color: '#0E0C0A',
                border: 'none',
                cursor: installing ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              <Download size={16} />
              {installing ? 'جاري التثبيت...' : 'ثبّت التطبيق الآن'}
            </button>
          ) : (
            /* المتصفح لم يُطلق beforeinstallprompt بعد (أو مثبَّت/مرفوض
               مسبقاً فلن يصل إطلاقاً) — خطوات يدوية تعمل دائماً كبديل مضمون */
            <div className="space-y-2.5">
              {[
                { n: 1, icon: <MoreVertical size={14} />, text: 'اضغط على القائمة (⋮) أعلى المتصفح' },
                { n: 2, icon: <Download size={14} />, text: 'اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"' },
                { n: 3, icon: <CheckCircle2 size={14} />, text: 'اضغط "تثبيت" في نافذة التأكيد' },
              ].map(({ n, icon, text }) => (
                <div key={n} className="flex flex-row-reverse items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-bronze/[0.15] text-bronze text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {n}
                  </span>
                  <span className="text-bronze/70 mt-0.5 shrink-0">{icon}</span>
                  <p className="text-xs text-muted-foreground text-right">{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* iOS — قسم واحد حصري؛ Safari لا يدعم beforeinstallprompt بأي
          إصدار، فالخطوات اليدوية هنا ثابتة دائماً ولا تتغيّر أبداً */}
      {!installed && platform === 'ios' && (
        <div className="rounded-2xl border border-border bg-card p-5 mb-5">
          <div className="flex flex-row-reverse items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-bronze/[0.12] flex items-center justify-center text-bronze shrink-0">
              <Apple size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-text">iPhone / iPad</p>
              <p className="text-xs text-muted-foreground">يجب استخدام Safari لتثبيت التطبيق على iOS</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {[
              {
                n: 1,
                icon: <Share size={15} className="text-blue-400" />,
                title: 'اضغط زر المشاركة',
                desc: 'الأيقونة المربّعة بسهم للأعلى في شريط Safari السفلي',
              },
              {
                n: 2,
                icon: <Plus size={15} className="text-bronze" />,
                title: 'اختر "إضافة إلى الشاشة الرئيسية"',
                desc: 'مرّر للأسفل في القائمة حتى تجد هذا الخيار',
              },
              {
                n: 3,
                icon: <CheckCircle2 size={15} className="text-green-400" />,
                title: 'اضغط "إضافة"',
                desc: 'سيظهر التطبيق على شاشتك الرئيسية فوراً',
              },
            ].map(({ n, icon, title, desc }) => (
              <div key={n} className="flex flex-row-reverse items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-bronze/[0.12] text-bronze text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {n}
                </span>
                <div className="flex-1 text-right">
                  <div className="flex flex-row-reverse items-center gap-1.5 mb-0.5">
                    {icon}
                    <p className="text-sm font-semibold text-text">{title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* تصوير توضيحي نصي لشريط Safari */}
          <div className="mt-4 p-3 rounded-xl bg-background/60 border border-border text-center">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-card mb-2">
              <div className="w-5 h-5 text-blue-400 flex items-center justify-center">
                <Share size={16} />
              </div>
              <span className="text-[11px] text-muted-foreground/60 font-mono">{window.location.hostname}</span>
              <div className="w-5" />
            </div>
            <p className="text-[10px] text-muted-foreground/50">↑ شريط Safari — زر المشاركة على اليسار</p>
          </div>
        </div>
      )}

      {/* سطح المكتب — قسم ثالث منفصل بوضوح؛ Chrome/Edge على الكمبيوتر
          يدعمان beforeinstallprompt أيضاً، فنفس منطق Android لكن بنص
          مختلف (لا "هاتف" في الوصف) */}
      {!installed && platform === 'desktop' && (
        <div className="rounded-2xl border border-bronze/20 bg-card p-5 mb-5">
          <div className="flex flex-row-reverse items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-bronze/[0.12] flex items-center justify-center text-bronze shrink-0">
              <Download size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-text">سطح المكتب</p>
              <p className="text-xs text-muted-foreground">Chrome أو Edge — تثبيت كبرنامج مستقل</p>
            </div>
          </div>

          {deferredPrompt ? (
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] font-bold text-sm"
              style={{
                background: installing
                  ? 'rgba(var(--bronze-rgb),0.4)'
                  : 'linear-gradient(135deg, var(--color-bronze,#C8A870), var(--color-bronze-light,#DCC394))',
                color: '#0E0C0A',
                border: 'none',
                cursor: installing ? 'not-allowed' : 'pointer',
              }}
            >
              <Download size={16} />
              {installing ? 'جاري التثبيت...' : 'ثبّت التطبيق الآن'}
            </button>
          ) : (
            <div className="space-y-2.5">
              {[
                { n: 1, icon: <MoreVertical size={14} />, text: 'اضغط على أيقونة التثبيت ⊕ في شريط العنوان' },
                { n: 2, icon: <Download size={14} />, text: 'أو افتح القائمة (⋮) ← "تثبيت فريق ألفا"' },
              ].map(({ n, icon, text }) => (
                <div key={n} className="flex flex-row-reverse items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-bronze/[0.15] text-bronze text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {n}
                  </span>
                  <span className="text-bronze/70 mt-0.5 shrink-0">{icon}</span>
                  <p className="text-xs text-muted-foreground text-right">{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* مميزات التطبيق */}
      <div className="rounded-2xl border border-border bg-card/50 p-5">
        <p className="text-xs font-bold text-bronze text-right mb-3">لماذا التطبيق؟</p>
        <div className="space-y-2.5">
          {[
            { emoji: '⚡', text: 'يفتح فوراً بدون انتظار تحميل المتصفح' },
            { emoji: '📶', text: 'يعمل حتى بدون اتصال بالإنترنت' },
            { emoji: '🔔', text: 'إشعارات عند صدور تعريبات جديدة' },
            { emoji: '📱', text: 'تجربة كاملة كأي تطبيق على هاتفك' },
            { emoji: '🆓', text: 'مجاني بالكامل — بدون متجر تطبيقات' },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex flex-row-reverse items-center gap-2.5">
              <span className="text-base shrink-0">{emoji}</span>
              <p className="text-xs text-muted-foreground text-right">{text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
