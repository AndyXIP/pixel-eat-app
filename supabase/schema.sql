-- ============================================================
-- pixel-eat schema
-- Paste into: Supabase Dashboard → SQL Editor → New query
-- ============================================================


-- ── Profiles ────────────────────────────────────────────────
-- Extends Supabase auth.users (one row per user)

create table profiles (
  id           uuid references auth.users on delete cascade primary key,
  username     text unique not null,
  display_name text not null,
  avatar_url   text,
  created_at   timestamptz default now()
);

-- Auto-create a profile row whenever someone signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, display_name)
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
  for each row execute procedure handle_new_user();


-- ── Posts ────────────────────────────────────────────────────

create table posts (
  id                 uuid default gen_random_uuid() primary key,
  user_id            uuid references profiles on delete cascade not null,
  photo_url          text,
  cuisine            text,                          -- ISO 3166-1 alpha-2 e.g. 'tw', 'kr'
  caption            text,
  logged_date        date not null default current_date,
  -- sprite compositor data
  vessel             text,
  base               text,
  toppings           text[],
  sprite_bg_color    text,
  sprite_accent_color text,
  is_hot             boolean default false,
  created_at         timestamptz default now()
);


-- ── Recipes ──────────────────────────────────────────────────

create table recipes (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references profiles on delete cascade not null,
  name            text not null,
  cuisine         text,                             -- ISO 3166-1 alpha-2
  ingredients     text[],
  notes           text,
  last_made       date,
  shared_from_id  uuid references recipes on delete set null, -- set when shared from another user
  created_at      timestamptz default now()
);


-- ── Follows ──────────────────────────────────────────────────

create table follows (
  follower_id  uuid references profiles on delete cascade,
  following_id uuid references profiles on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id)
);


-- ── Pinned dishes ────────────────────────────────────────────
-- Each row links a user's pinned slot to a post

create table pinned_dishes (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references profiles on delete cascade not null,
  post_id    uuid references posts on delete set null,
  bg_color   text,
  sort_order int default 0,
  created_at timestamptz default now()
);


-- ── Indexes ──────────────────────────────────────────────────

create index posts_user_id_idx       on posts(user_id);
create index posts_logged_date_idx   on posts(logged_date);
create index recipes_user_id_idx     on recipes(user_id);
create index follows_follower_idx    on follows(follower_id);
create index follows_following_idx   on follows(following_id);


-- ── Row Level Security ───────────────────────────────────────

alter table profiles     enable row level security;
alter table posts        enable row level security;
alter table recipes      enable row level security;
alter table follows      enable row level security;
alter table pinned_dishes enable row level security;

-- profiles: anyone can read, only owner can write
create policy "profiles: public read"        on profiles for select using (true);
create policy "profiles: owner insert"       on profiles for insert with check (auth.uid() = id);
create policy "profiles: owner update"       on profiles for update using (auth.uid() = id);

-- posts: visible to own user + followers
create policy "posts: owner or follower read" on posts for select using (
  user_id = auth.uid()
  or exists (
    select 1 from follows
    where follower_id = auth.uid() and following_id = posts.user_id
  )
);
create policy "posts: owner insert"  on posts for insert with check (auth.uid() = user_id);
create policy "posts: owner update"  on posts for update using (auth.uid() = user_id);
create policy "posts: owner delete"  on posts for delete using (auth.uid() = user_id);

-- recipes: private to owner only
create policy "recipes: owner read"   on recipes for select using (auth.uid() = user_id);
create policy "recipes: owner insert" on recipes for insert with check (auth.uid() = user_id);
create policy "recipes: owner update" on recipes for update using (auth.uid() = user_id);
create policy "recipes: owner delete" on recipes for delete using (auth.uid() = user_id);

-- follows: anyone can read, only follower can insert/delete
create policy "follows: public read"    on follows for select using (true);
create policy "follows: owner insert"   on follows for insert with check (auth.uid() = follower_id);
create policy "follows: owner delete"   on follows for delete using (auth.uid() = follower_id);

-- pinned dishes: public read, owner write
create policy "pinned: public read"   on pinned_dishes for select using (true);
create policy "pinned: owner all"     on pinned_dishes for all using (auth.uid() = user_id);
