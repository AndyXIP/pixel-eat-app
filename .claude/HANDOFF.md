# pixel-eat — handoff context

## Goal for new chat
Migrate all remaining mock endpoints to real Supabase DB queries, and remove mock_data.py entirely.

---

## What this app is
A pixel-art food diary / social cooking app. Users log dishes, follow friends, cook from recipes, participate in monthly food challenges. Pixel/retro aesthetic using the Micro 5 font throughout.

---

## Stack
- **Frontend**: Expo (React Native) + TypeScript, expo-router file-based routing
- **Backend**: FastAPI (Python), `http://127.0.0.1:8000` in dev
- **Auth + DB**: Supabase (email/password, Postgres, Storage for photos)
- **Font**: `Micro5_400Regular` via `@expo-google-fonts/micro-5`

---

## Repo layout

```
pixel-eat-app/                        # Expo frontend
  app/
    _layout.tsx                       # Root layout — auth gate, session listener, splash screen
    login.tsx                         # Email/password sign in + sign up via Supabase
    (tabs)/
      _layout.tsx                     # Tab navigator using CustomTabBar
      index.tsx                       # FRIENDS tab — feed + add friends modal
      diary.tsx                       # DIARY tab — calendar, stats, events, dishes this week
      recipe.tsx                      # RECIPE tab — list, search, swipe-delete, add modal
      profile.tsx                     # PROFILE tab — stats, pinned dishes, ingredient/cuisine analytics
    post/
      create.tsx                      # New post modal — vessel/toppings/caption, calls POST /posts/quick
  components/
    CustomTabBar.tsx                  # Bottom bar — duck centre button (action sheet: new post / sign out)
    PostCard.tsx                      # Feed post card — toggleable photo vs sprite view
    DishModal.tsx                     # Bottom sheet — dish image, ingredients, open recipe
    RecipeModal.tsx                   # Bottom sheet — recipe ingredients, notes
    SpriteCompositor.tsx              # Pixel art compositor (vessel + toppings on colour bg)
  services/
    api.ts                            # All typed API functions + response types
  constants/
    api.ts                            # apiFetch() with JWT injection; apiImageUrl()
    theme.ts                          # Font + FontSize design tokens (all components import from here)
    ingredientImages.ts               # Local require() map for ingredient sprites (bundled, not fetched)
  hooks/
    useApi.ts                         # Generic useState+useEffect fetch hook → { data, loading, error }
  lib/
    supabase.ts                       # Supabase client (AsyncStorage on native, localStorage on web)
  .env
    EXPO_PUBLIC_SUPABASE_URL
    EXPO_PUBLIC_SUPABASE_ANON_KEY
    EXPO_PUBLIC_DEV_API_URL=http://127.0.0.1:8000
    EXPO_PUBLIC_PROD_API_URL=https://pixel-eat-api.onrender.com
    EXPO_PUBLIC_ENVIRONMENT=development   # → "production" for prod build

pixel-eat-api/                        # FastAPI backend
  src/
    main.py                           # CORS, static /images file server, all routers registered
    config.py                         # Pydantic settings from .env
    database.py                       # Supabase client (service role key)
    dependencies.py                   # get_current_user() — verifies JWT via supabase.auth.get_user()
    mock_data.py                      # ALL MOCK DATA LIVES HERE — to be deleted once migration done
    views/
      feed.py                         # GET /feed                  🟡 MOCK
      diary.py                        # GET /diary                 🟡 MOCK
      events.py                       # GET /events/current        🟡 MOCK
      recipes_mock.py                 # GET /recipes               🟡 MOCK
      profile_mock.py                 # GET /profile/me            🟡 MOCK
      friends_mock.py                 # GET+POST+DELETE /friends   ✅ REAL (queries public.users + follows)
      posts.py                        # POST /posts/quick          ✅ REAL (inserts to posts table)
                                      # POST /posts                ✅ REAL (full, with photo upload)
                                      # GET /posts/{id}            ✅ REAL
      users.py                        # GET /users/{id}            ✅ REAL
                                      # PUT /users/me              ✅ REAL
      ingredients.py                  # GET /ingredients           ✅ REAL
                                      # GET /ingredients/seasonal  ✅ REAL
      badges.py                       # GET /users/{id}/badges     ✅ REAL
    schemas/
      post.py                         # PostCreate, QuickPostCreate, PostResponse, FeedPost
      user.py                         # UserCreate, UserUpdate, UserResponse, NotificationPref
    services/
      post_service.py                 # Full post creation: photo upload, ingredients insert, badge eval
      storage_service.py              # Supabase Storage upload → returns public URL
  .env
    SUPABASE_URL
    SUPABASE_SERVICE_KEY
    STORAGE_BUCKET=posts
    BASE_URL=http://127.0.0.1:8000
```

---

## All API endpoints

| Method | Path | Auth | Status | Notes |
|--------|------|------|--------|-------|
| GET | `/feed` | ✅ | 🟡 MOCK | Returns hardcoded `FEED_POSTS` |
| GET | `/diary` | ✅ | 🟡 MOCK | Returns hardcoded `DIARY` |
| GET | `/events/current` | ✅ | 🟡 MOCK | Returns hardcoded `CURRENT_EVENT` |
| GET | `/recipes` | ✅ | 🟡 MOCK | Returns hardcoded `RECIPES` |
| GET | `/profile/me` | ✅ | 🟡 MOCK | Returns hardcoded `PROFILE` |
| GET | `/friends` | ✅ | ✅ REAL | Queries `follows` → `public.users` |
| GET | `/friends/search?q=` | ✅ | ✅ REAL | Searches `public.users` by username/display_name |
| POST | `/friends/{user_id}` | ✅ | ✅ REAL | Upserts into `follows` |
| DELETE | `/friends/{user_id}` | ✅ | ✅ REAL | Deletes from `follows` |
| POST | `/posts/quick` | ✅ | ✅ REAL | Inserts post with placeholder photo URL |
| POST | `/posts` | ✅ | ✅ REAL | Full post with Supabase Storage photo upload |
| GET | `/posts/{id}` | ✅ | ✅ REAL | Fetches post by ID |
| GET | `/users/{id}` | ✅ | ✅ REAL | Fetches user profile |
| PUT | `/users/me` | ✅ | ✅ REAL | Updates current user |
| GET | `/ingredients` | ✅ | ✅ REAL | All ingredients |
| GET | `/ingredients/seasonal` | ✅ | ✅ REAL | Currently available seasonal ingredients |
| GET | `/users/{id}/badges` | ✅ | ✅ REAL | User badges |
| GET | `/utils/health` | ❌ | ✅ REAL | Health check |
| GET | `/images/...` | ❌ | static | Static file server (mock content images) |

---

## Frontend API types (services/api.ts)

```ts
ApiUser       { id, displayName, username, avatarUrl }
ApiPost       { id, photoUrl, cuisine, user: ApiUser, date, caption, timeAgo, ingredients, spriteColors, isHot }
ApiRecipe     { id, name, cuisine, creatorColor, creatorUsername?, creatorAvatarUrl, lastMade, ingredients[], notes }
ApiDish       { id, bg, imageUrl, name, cuisine, ingredients[], recipe: ApiRecipe | null }
ApiLoggedDay  { day, photoUrl, caption }
ApiDiary      { month, year, monthIndex, loggedDays[], stats{}, challengeTitle, challengeDetail, lanternProgress, dishesThisWeek[] }
ApiProfile    { displayName, username, avatarUrl, stats{}, pinnedDishes[], ingredientData[], cuisineData[] }
ApiEvent      { title, detail{ description, ingredients[], featuredRecipes[] }, lanternProgress }

// Calls:
getFeed()                → GET /feed
getRecipes()             → GET /recipes
getDiary()               → GET /diary
getProfile()             → GET /profile/me
getEvent()               → GET /events/current
getFriends()             → GET /friends
searchUsers(q)           → GET /friends/search?q=
addFriend(id)            → POST /friends/{id}
removeFriend(id)         → DELETE /friends/{id}
createQuickPost(data)    → POST /posts/quick
```

---

## Supabase DB tables

### Already needed by live endpoints (must exist now)

```sql
-- User profiles — mirrors auth.users
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  notification_pref text not null default 'both',
  notification_time text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing auth users
insert into public.users (id, username, display_name)
select id, split_part(email, '@', 1), split_part(email, '@', 1)
from auth.users
on conflict (id) do nothing;

-- Follow relationships
create table follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

-- Posts
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  photo_url text not null,
  vessel_type text not null,  -- 'bowl','plate','box','wrap','cup','other'
  is_hot bool not null default true,
  caption text,
  posted_at timestamptz not null default now(),
  expires_at timestamptz not null,
  late_post_mins int not null default 0
);
```

### Needed for full migration (mock → real)

```sql
-- Recipes (for GET /recipes migration)
create table recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cuisine text,               -- country code e.g. 'tw', 'jp'
  notes text,
  last_made date,
  created_at timestamptz default now()
);

create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_name text not null,
  sort_order int not null default 0
);

-- Ingredients (already queried by /ingredients endpoint)
create table ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null,         -- 'always' | 'seasonal'
  available_from date,
  available_until date
);

-- Post → ingredients join
create table post_ingredients (
  post_id uuid not null references posts(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id),
  added_at timestamptz default now(),
  post_time bool default true,
  ai_suggested bool default false,
  user_confirmed bool default true,
  primary key (post_id, ingredient_id)
);

-- Badges (already queried by /users/{id}/badges)
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_url text
);

create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references badges(id),
  earned_at timestamptz default now(),
  post_id uuid references posts(id)
);

-- Events / challenges (for GET /events/current migration — design TBD)
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz default now()
);

create table event_ingredients (
  event_id uuid not null references events(id) on delete cascade,
  label text not null,
  image_key text not null     -- maps to local bundled sprite key in frontend
);

create table event_featured_recipes (
  event_id uuid not null references events(id) on delete cascade,
  recipe_name text not null
);
```

---

## What still needs migrating (mock → real)

These 5 view files still return hardcoded data from `mock_data.py` and need to be replaced:

### 1. `views/feed.py` → GET /feed
**Needs**: Query `posts` joined with `public.users`, filtered to users the caller follows (via `follows` table), ordered by `posted_at` desc. Return shape must match `ApiPost` (camelCase).

### 2. `views/profile_mock.py` → GET /profile/me
**Needs**: Query `public.users` for current user. Aggregate post count, badge count from `user_badges`. Top ingredients + cuisines from `post_ingredients` + `posts`. Return `pinnedDishes` (latest N posts by user as dishes). Shape must match `ApiProfile`.

### 3. `views/recipes_mock.py` → GET /recipes
**Needs**: Query `recipes` + `recipe_ingredients` for current user. Return list matching `ApiRecipe` shape (camelCase). Also needs a `POST /recipes` endpoint to save new recipes (currently the add-recipe form in the app saves to local state only).

### 4. `views/diary.py` → GET /diary
**Needs**: Query current user's `posts` for the current month to build `loggedDays[]`. Aggregate `stats` (dishes logged, streaks, etc.) from posts. `dishesThisWeek` = posts from last 7 days as `ApiDish`. Challenge data can come from `events` table or stay mock initially.

### 5. `views/events.py` → GET /events/current
**Needs**: Query `events` table for the currently active event (where `now()` between `starts_at` and `ends_at`). Join `event_ingredients` and `event_featured_recipes`. Can stay mock until the `events` table is populated.

---

## Auth flow
1. Frontend: `supabase.auth.signInWithPassword()` → gets JWT
2. Frontend: every `apiFetch()` call attaches `Authorization: Bearer <jwt>`
3. Backend: `dependencies.get_current_user()` calls `supabase.auth.get_user(token)` → returns `{ id, email }`
4. All endpoints use `Depends(get_current_user)` — returns 401 if missing/invalid
5. Sign out: `supabase.auth.signOut()` — available in duck button action sheet and profile tab

---

## Image architecture
- **Content images** (post photos, profile pics, food photos): currently served by FastAPI static file server at `/images/...` from `pixel-eat-api/assets/images/`. When migrated, API returns Supabase Storage public URLs and the static server is no longer needed.
- **Sprite/UI assets** (ingredient sprites, duck logo, lanterns, lucky duck): bundled in the Expo app via `require()` in `constants/ingredientImages.ts` and inline in components. Never fetched from network.
- `apiImageUrl(path)` in `constants/api.ts` builds full URLs for the static server — call sites will just use the URL returned by the API once migrated.

---

## Design tokens (constants/theme.ts)
```ts
Font.pixel = 'Micro5_400Regular'   // never hardcode font name in components
FontSize.xs = 14  | sm = 16  | md = 18  | lg = 20
FontSize.xl = 26  | stat = 32 | display = 80
```
Accent colour: `#E05252` (red). Used for active states, destructive actions, recipe names, challenge titles.
All components import `{ Font, FontSize }` from `@/constants/theme` — never hardcode values.
