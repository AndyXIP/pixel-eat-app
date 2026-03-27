# pixel-eat — Claude context

## What this app is
A pixel-art food diary / social cooking app. Users log dishes, follow friends, cook from recipes, and participate in monthly food challenges. The aesthetic is pixel/retro using the Micro 5 font throughout.

## Stack
- **Expo** (React Native) with **expo-router** file-based routing
- **TypeScript**
- Font: `Micro5_400Regular` via `@expo-google-fonts/micro-5`
- No backend yet — all data is static mock data in `constants/mockData.ts`

---

## Design tokens — change here, applies everywhere

### `constants/theme.ts`
All font and size decisions live here. Never hardcode these values in components.

```ts
export const Font = {
  pixel: 'Micro5_400Regular',  // swap font here to change it app-wide
};

export const FontSize = {
  xs:      14,  // tiny secondary labels
  sm:      16,  // timestamps, meta text
  md:      18,  // primary body, names
  lg:      20,  // section headers
  xl:      26,  // screen titles, display names
  stat:    32,  // stat numbers
  display: 80,  // big one-off numbers (diary duck)
};
```

Every file imports `{ Font, FontSize }` from `@/constants/theme` and uses `fontFamily: Font.pixel` and `fontSize: FontSize.xx`. Never hardcode `'Micro5_400Regular'` or raw font size numbers.

---

## Screens

### Friends (`app/(tabs)/index.tsx`)
Feed of posts from people the user follows. Each post rendered by `PostCard`.

### Diary (`app/(tabs)/diary.tsx`)
Two tabs at the top:
- **DIARY** — full month calendar grid (logged days show 🍳), stats row (recipes shared, dishes logged, new recipes, challenge recipes, day streak), dishes this week grid
- **EVENTS** — only shown when `DIARY.challengeTitle` is set; shows the active challenge title, tappable lucky duck image, lantern progress grid, meals-until-badge counter

The duck (`lucky_duck.png`) is tappable and opens a `ChallengeModal` with the full challenge description, seasonal ingredients grid, and featured LNY recipes.

The `loggedDays` array in mock data is currently hardcoded — not yet derived from real post data.

### Recipe (`app/(tabs)/recipe.tsx`)
- Search bar filters by **name or ingredient** (not just name)
- `+` button (not yet wired to a creation flow)
- Swipe a row left to reveal red 🗑 delete button; tap to confirm delete
- Tap a row to open `RecipeModal` (slides up from bottom) showing: name, ingredients list, notes/instructions

### Profile (`app/(tabs)/profile.tsx`)
- Avatar, display name, username, edit button
- Pinned dishes row
- Stats row (5 stats)
- "Most Used Ingredient" — shows top emoji; **tap** to open modal with top 3 ranked by percentage
- "Most Cooked Cuisine" — shows top country flag; **tap** to open modal with top 3 ranked by percentage

---

## Components

### `components/CustomTabBar.tsx`
Custom bottom tab bar. Centre button is a circular duck logo (`duck_logo.png`) that navigates to the post creation modal. Tab labels use `Font.pixel` + `FontSize.sm`.

### `components/PostCard.tsx`
Renders a single feed post:
- Header: avatar, display name, username, date
- Card: `SpriteCompositor` fills the card edge-to-edge (absolute fill), photo thumbnail corner, hot steam overlay, caption/time overlay
- Topping tags bar below the card (not overlaid on the image)

### `components/SpriteCompositor.tsx`
Placeholder pixel art dish compositor. In production, replace the emoji/view layers with CDN PNG `<Image>` layers (vessel → base → toppings → garnish). When `size` prop is omitted, it uses `absoluteFill` to fill its parent. When a specific `size` number is passed, it renders at that fixed size.

---

## Assets (`assets/images/`)
| File | Used in |
|---|---|
| `duck_logo.png` | CustomTabBar centre button |
| `lucky_duck.png` | Diary events tab (tappable, opens challenge modal) |
| `latern.png` | Diary lantern progress — filled state (note: filename typo, missing 'n') |
| `lantern_bw.png` | Diary lantern progress — empty/unfilled state |

---

## Mock data (`constants/mockData.ts`)
Three exports:
- `FEED_POSTS` — posts for the friends feed
- `PROFILE` — user profile, stats, pinned dishes, `ingredientData` (array with pct), `cuisineData` (array with flag + pct)
- `RECIPES` — array with `id, name, creatorColor, lastMade, ingredients[], notes`
- `DIARY` — month, calendar config, `loggedDays[]`, `stats{}`, challenge info, `challengeDetail{}`, lantern progress, dishes this week

---

## Conventions
- All `fontFamily` → `Font.pixel`, all `fontSize` → `FontSize.xx`
- No default font size numbers in component files
- `SpriteCompositor` omit `size` prop for full-bleed (feed cards); pass explicit `size` for fixed-size uses
- Swipe-to-delete uses `PanResponder` + `Animated` — no third-party gesture library
- Modals use React Native `Modal` with a semi-transparent `Pressable` backdrop to dismiss
- Recipe deletions are local component state (not persisted)
- The `explore` tab has been removed entirely
