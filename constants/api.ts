import { supabase } from '@/lib/supabase';

const isProd = process.env.EXPO_PUBLIC_ENVIRONMENT === 'production';

const API_BASE_URL: string = isProd
  ? (process.env.EXPO_PUBLIC_PROD_API_URL ?? 'https://pixel-eat-api.onrender.com')
  : (process.env.EXPO_PUBLIC_DEV_API_URL ?? 'http://127.0.0.1:8000');

export async function apiFetch(path: string, options?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

/** Build a full URL for a static image served by the API. */
export function apiImageUrl(path: string): string {
  return `${API_BASE_URL}/images/${path}`;
}

export default API_BASE_URL;
