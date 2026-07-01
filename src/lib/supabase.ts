// lib/supabase.ts
// ponytail: منقول من team-apk/lib/supabase.ts — نفس نمط REST المباشر (وليس
// عميل @supabase/supabase-js الكامل) لتفادي حزمة إضافية ثقيلة لا حاجة لها،
// بما أن كل الاستخدام هنا هو SELECT بسيط عبر PostgREST. الفرق الوحيد عن
// النسخة الأصلية: متغيرات البيئة بصيغة Vite (VITE_*) بدل Expo (EXPO_PUBLIC_*).

const BASE = import.meta.env.VITE_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function headers() {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function supabaseQuery<T>(
  table: string,
  params = '',
  range?: [number, number]
): Promise<T[]> {
  const sep = params ? '&' : '';
  const url = `${BASE}/rest/v1/${table}?select=*${sep}${params}`;
  const h: Record<string, string> = { ...headers() };
  if (range) h['Range'] = `${range[0]}-${range[1]}`;
  const res = await fetch(url, { headers: h });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase ${table} ${res.status}: ${text}`);
  }
  return res.json();
}

export async function supabaseSingle<T>(table: string, filter = ''): Promise<T | null> {
  const sep = filter ? '&' : '';
  const url = `${BASE}/rest/v1/${table}?select=*${sep}${filter}`;
  const res = await fetch(url, {
    headers: {
      ...headers(),
      Accept: 'application/vnd.pgrst.object+json',
    },
  });
  if (res.status === 406 || res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function supabaseDownloadsWithChangelog<T>(range?: [number, number]): Promise<T[]> {
  // ponytail: بدون !left كان PostgREST يعمل INNER JOIN مع changelogs —
  // أي تحميل changelog_id=null أو يشير لسجل محذوف يختفي من النتائج كلياً.
  // !left يجبره على LEFT JOIN فيظهر التحميل حتى لو لم يُجد changelog مطابق
  // (تعود changelog كـ null بدل إخفاء الصف بالكامل).
  const url = `${BASE}/rest/v1/downloads?select=*,changelog:changelogs!left(version,date)&order=created_at.desc`;
  const h: Record<string, string> = { ...headers() };
  if (range) h['Range'] = `${range[0]}-${range[1]}`;
  const res = await fetch(url, { headers: h });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase downloads ${res.status}: ${text}`);
  }
  return res.json();
}
