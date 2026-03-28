const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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
