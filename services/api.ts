import { apiFetch } from '@/constants/api';

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

export const getFeed    = (): Promise<ApiPost[]>    => apiFetch('/feed');
export const getRecipes = (): Promise<ApiRecipe[]>  => apiFetch('/recipes');
export const getDiary   = (): Promise<ApiDiary>     => apiFetch('/diary');
export const getProfile = (): Promise<ApiProfile>   => apiFetch('/profile/me');
export const getEvent   = (): Promise<ApiEvent>     => apiFetch('/events/current');
