# pixel-eat

![Status](https://img.shields.io/badge/Status-Complete-success) ![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white) ![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=06192E) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase&logoColor=white)

A pixel-art food diary and social cooking app. Log dishes, follow friends, cook from recipes, and participate in monthly food challenges — all wrapped in a retro pixel aesthetic.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Design Tokens](#design-tokens)
- [Development Notes](#development-notes)
- [Suggested Future Directions](#suggested-future-directions)

---

## Overview

pixel-eat is a mobile-first social food app built with Expo and React Native. Users keep a visual diary of dishes they've cooked, browse a friends feed of recent posts, manage a recipe collection, and join seasonal cooking challenges. The entire UI uses the Micro 5 pixel font to give it a consistent retro game aesthetic.

---

## Features

### Friends Feed

- **Social Posts**: See dishes your friends have cooked with pixel-art composited visuals
- **PostCard**: Avatar, display name, caption, topping tags, and a full-bleed sprite compositor
- **Hot Steam Overlay**: Animated visual flair on freshly logged dishes

### Diary

- **Month Calendar**: Grid view with logged days marked; tap any day to see its dishes
- **Stats Row**: Recipes shared, dishes logged, new recipes, challenge recipes, day streak
- **Weekly Dishes Grid**: Quick glance at the current week's cooking activity
- **Events Tab**: Active monthly challenge with lucky duck mascot, seasonal ingredients, lantern progress tracker, and featured recipes

### Recipes

- **Search**: Filter recipes by name or ingredient
- **Swipe to Delete**: Swipe a row left to reveal a delete button (no third-party gesture library)
- **Recipe Modal**: Full-screen slide-up with ingredients list and notes/instructions
- **Add Flow**: `+` button wired to creation (in progress)

### Profile

- **Stats Row**: Five key cooking stats at a glance
- **Pinned Dishes**: Showcase your favourite logged dishes
- **Most Used Ingredient**: Tap to open a ranked top-3 modal with percentages
- **Most Cooked Cuisine**: Tap to open a ranked top-3 modal with country flags and percentages

---

## Architecture

```
┌──────────────────────────────────┐
│  Expo Router (file-based routing)│
│  app/(tabs)/ — four tab screens  │
│  app/post/create — post creation │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│  React Native Components         │
│  CustomTabBar, PostCard,         │
│  SpriteCompositor, Modals        │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│  Data Layer                      │
│  DataContext (React Context)     │
│  services/api.ts + useApi hook   │
│  Supabase (auth + data)          │
└──────────────────────────────────┘
```

---

## Tech Stack

- **Expo 54** — managed workflow, EAS build
- **React Native 0.81 / React 19** — cross-platform mobile UI
- **expo-router** — file-based navigation
- **TypeScript 5** — type-safe throughout
- **Supabase** — auth and backend database
- **@expo-google-fonts/micro-5** — Micro 5 pixel font
- **react-native-circle-flags** — country flag rendering for cuisine stats
- **expo-image** — optimised image loading
- **expo-image-picker** — photo selection for new posts

---

## Project Structure

```
pixel-eat-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar layout
│   │   ├── index.tsx           # Friends feed
│   │   ├── diary.tsx           # Diary + Events
│   │   ├── recipe.tsx          # Recipe list
│   │   └── profile.tsx         # User profile
│   ├── post/
│   │   └── create.tsx          # Post creation screen
│   ├── login.tsx               # Auth screen
│   ├── modal.tsx               # Generic modal shell
│   └── _layout.tsx             # Root layout
├── components/
│   ├── CustomTabBar.tsx        # Bottom tab bar with duck logo
│   ├── PostCard.tsx            # Feed post card
│   ├── SpriteCompositor.tsx    # Pixel-art dish compositor
│   ├── RecipeModal.tsx         # Recipe detail slide-up
│   └── DishModal.tsx           # Dish detail modal
├── constants/
│   ├── theme.ts                # Font + FontSize design tokens
│   ├── mockData.ts             # Static mock data (FEED_POSTS, PROFILE, RECIPES, DIARY)
│   └── api.ts                  # API base config
├── contexts/
│   └── DataContext.tsx         # Global data provider
├── hooks/
│   └── useApi.ts               # Data fetching hook
├── lib/
│   └── supabase.ts             # Supabase client
├── services/
│   └── api.ts                  # API service layer
├── assets/
│   └── images/
│       ├── duck_logo.png       # Tab bar centre button
│       ├── lucky_duck.png      # Diary challenge mascot
│       ├── latern.png          # Lantern progress — filled
│       └── lantern_bw.png      # Lantern progress — empty
├── app.config.js
├── package.json
└── tsconfig.json
```

---

## Getting Started

**Prerequisites:** [mise](https://mise.jdx.dev/) (manages Node.js and other runtimes), Expo CLI, iOS Simulator or Android Emulator (or Expo Go)

Install runtimes via mise:

```bash
mise install
```

```bash
npm install
```

Copy the environment template and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Start the development server:

```bash
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

---

## Configuration

### Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Design Tokens

All font and size decisions live in `constants/theme.ts`. Never hardcode values in components — always import from here.

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

---

## Development Notes

- **Mock Data**: All screens currently run off `constants/mockData.ts` — no live backend calls required to explore the UI
- **Swipe-to-Delete**: Implemented with `PanResponder` + `Animated`; no third-party gesture library
- **SpriteCompositor**: Placeholder pixel compositor — omit `size` prop for full-bleed feed cards, pass explicit `size` for fixed thumbnails. In production, replace emoji layers with CDN PNG `<Image>` layers (vessel → base → toppings → garnish)
- **Modals**: All modals use React Native `Modal` with a semi-transparent `Pressable` backdrop to dismiss
- **Recipe Deletions**: Local component state only — not persisted
- **Font**: Loaded via `expo-font` at app startup; all text uses `Font.pixel` from theme
- **Asset Note**: `latern.png` has a typo in the filename (missing an 'n') — referenced as-is throughout the codebase

---

## Suggested Future Directions

- Wire up post creation flow (camera, sprite compositor, topping selection)
- Replace mock data with live Supabase queries throughout
- Add real friend/follow system with Supabase relationships
- Persist recipe additions and deletions to the database
- Implement the full challenge system (join, track progress, badge awards)
- Push notifications for friend activity and challenge milestones
- CDN-hosted sprite assets for the dish compositor layers
- Social features: likes, comments, bookmarks on posts
- Ingredient recognition via camera (ML-based)
- Export / share a dish card as an image
- Unit and integration tests
- EAS build pipeline for TestFlight / Play Store distribution
