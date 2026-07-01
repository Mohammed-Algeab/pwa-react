// hooks/useColors.ts
// ponytail: غالب التصميم هنا يستخدم Tailwind utilities (bg-background,
// text-bronze...) المربوطة بـCSS variables في index.css، فلا تحتاج لهذا
// الـhook. لكن لبعض الحالات (ألوان SVG inline، رسوم بيانية، إلخ) نحتاج القيم
// الفعلية كـobject — هذا الـhook يقرأها من المتغيرات نفسها وقت الطلب.
import { useEffectiveTheme } from '@/contexts/SettingsContext';

const palettes = {
  dark: {
    text: '#F5F0E8',
    background: '#0E0C0A',
    card: '#14110E',
    primary: '#C8A870',
    primaryForeground: '#0E0C0A',
    muted: '#1A1713',
    mutedForeground: '#B8AFA0',
    border: '#2A2520',
    bronze: '#C8A870',
    bronzeLight: '#DCC394',
    success: '#50C878',
    destructive: '#C85050',
  },
  light: {
    text: '#0E0C0A',
    background: '#F5F0E8',
    card: '#FFFFFF',
    primary: '#B8934A',
    primaryForeground: '#FFFFFF',
    muted: '#E8E3DB',
    mutedForeground: '#6B6560',
    border: '#D4CFC8',
    bronze: '#B8934A',
    bronzeLight: '#C8A870',
    success: '#1A7F37',
    destructive: '#C85050',
  },
} as const;

export function useColors() {
  const effectiveTheme = useEffectiveTheme();
  return palettes[effectiveTheme];
}
