// hooks/useVisitorHash.ts
// ponytail: نفس فكرة team-apk — UUID عشوائي محلي بالكامل (لا يرتبط بهوية
// حقيقية)، يُولَّد مرة واحدة ويُخزَّن. هنا: crypto.randomUUID() + localStorage
// بدل expo-crypto + AsyncStorage.
const VISITOR_HASH_KEY = 'visitor_hash';
let cached: string | null = null;

export function getVisitorHash(): string {
  if (cached) return cached;
  const stored = localStorage.getItem(VISITOR_HASH_KEY);
  if (stored) {
    cached = stored;
    return stored;
  }
  const fresh = crypto.randomUUID();
  localStorage.setItem(VISITOR_HASH_KEY, fresh);
  cached = fresh;
  return fresh;
}
