import { apiFetch } from '@/constants/api';
import { supabase } from '@/lib/supabase';
import API_BASE_URL from '@/constants/api';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ApiUser = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
};

export type ApiPost = {
  id: string;
  photoUrl: string;
  cuisine: string;
  user: ApiUser;
  date: string;
  caption: string;
  timeAgo: string;
  ingredients: { vessel: string; base: string; toppings: string[] };
  spriteColors: { bg: string; accent: string };
  isHot: boolean;
};

export type ApiRecipe = {
  id: string;
  name: string;
  cuisine: string;
  creatorColor: string;
  creatorUsername?: string;
  creatorAvatarUrl: string;
  lastMade: string | null;
  ingredients: string[];
  notes: string;
};

export type ApiDish = {
  id: string;
  bg: string;
  imageUrl: string | null;
  name: string | null;
  cuisine: string | null;
  ingredients: string[];
  recipe: ApiRecipe | null;
};

export type ApiLoggedDay = {
  day: number;
  photoUrl: string | null;
  caption: string | null;
};

export type ApiDiary = {
  month: string;
  year: number;
  monthIndex: number;
  loggedDays: ApiLoggedDay[];
  stats: {
    recipesShared: number;
    dishesLogged: number;
    newRecipes: number;
    challengeRecipes: number;
    dayStreak: number;
  };
  challengeTitle: string | null;
  challengeDetail: {
    title: string;
    description: string;
    ingredients: { label: string; imageKey: string }[];
    featuredRecipes: string[];
  } | null;
  lanternProgress: { filled: number; total: number; mealsUntilBadge: number };
  dishesThisWeek: ApiDish[];
};

export type ApiProfile = {
  displayName: string;
  username: string;
  avatarUrl: string;
  stats: {
    recipesShared: number;
    dishesLogged: number;
    badgesObtained: number;
    weekStreak: number;
  };
  pinnedDishes: ApiDish[];
  ingredientData: { emoji: string; label: string; pct: number }[];
  cuisineData: { label: string; countryCode: string; pct: number }[];
};

export type ApiEvent = {
  title: string;
  detail: {
    title: string;
    description: string;
    ingredients: { label: string; imageKey: string }[];
    featuredRecipes: string[];
  };
  lanternProgress: { filled: number; total: number; mealsUntilBadge: number };
};

// ── API calls ──────────────────────────────────────────────────────────────────

export type ApiDishHistory = { id: string; date: string; photoUrl: string; name: string; cuisine: string | null; ingredients: string[]; recipe: ApiRecipe | null };

export const getFeed        = (): Promise<ApiPost[]>         => apiFetch('/feed');
export const getDishHistory = (): Promise<ApiDishHistory[]>  => apiFetch('/diary/dishes');
export const getRecipes   = (): Promise<ApiRecipe[]>  => apiFetch('/recipes');
export const getDiary     = (): Promise<ApiDiary>     => apiFetch('/diary');
export const getProfile   = (): Promise<ApiProfile>   => apiFetch('/profile/me');
export const getEvent     = (): Promise<ApiEvent>     => apiFetch('/events/current');
export const getFriends   = (): Promise<ApiUser[]>    => apiFetch('/friends');
export const searchUsers  = (q: string): Promise<ApiUser[]> => apiFetch(`/friends/search?q=${encodeURIComponent(q)}`);
export const addFriend    = (userId: string): Promise<{ ok: boolean }> => apiFetch(`/friends/${userId}`, { method: 'POST' });
export const removeFriend = (userId: string): Promise<{ ok: boolean }> => apiFetch(`/friends/${userId}`, { method: 'DELETE' });

export type QuickPostData = { vessel_type: string; is_hot: boolean; caption?: string; toppings: string[] };
export const createQuickPost = (data: QuickPostData): Promise<unknown> =>
  apiFetch('/posts/quick', { method: 'POST', body: JSON.stringify(data) });

export type ApiIngredient = { id: string; name: string; tier: string };
export const getIngredients = (): Promise<ApiIngredient[]> => apiFetch('/ingredients');

export const updateProfile = (data: { display_name?: string; avatar_url?: string }): Promise<unknown> =>
  apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(data) });

export async function uploadAvatar(photoUri: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const formData = new FormData();
  const filename = photoUri.split('/').pop() ?? 'avatar.jpg';
  const ext = (filename.split('.').pop() ?? 'jpg').toLowerCase();
  formData.append('photo', { uri: photoUri, name: filename, type: `image/${ext}` } as any);
  const res = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: 'POST',
    headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  const json = await res.json();
  return json.avatarUrl;
}

const VESSEL_DB_MAP: Record<string, string> = {
  bowl: 'bowl', plate: 'plate', wrap: 'wrap',
  mug: 'cup', soup: 'bowl', pan: 'other',
  sandwich: 'other', pizza: 'other',
};

export async function createPost(params: {
  vesselType: string;
  isHot: boolean;
  caption?: string;
  ingredientIds: string[];
  photoUri: string;
}): Promise<unknown> {
  const { data: { session } } = await supabase.auth.getSession();

  const formData = new FormData();
  formData.append('vessel_type', VESSEL_DB_MAP[params.vesselType] ?? 'other');
  formData.append('is_hot', String(params.isHot));
  formData.append('ingredient_ids', JSON.stringify(params.ingredientIds));
  formData.append('late_post_mins', '0');
  if (params.caption) formData.append('caption', params.caption);

  const filename = params.photoUri.split('/').pop() ?? 'photo.jpg';
  const ext = (filename.split('.').pop() ?? 'jpg').toLowerCase();
  formData.append('photo', { uri: params.photoUri, name: filename, type: `image/${ext}` } as any);

  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}
