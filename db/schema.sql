-- ProfitLens Pro — Supabase Database Schema
-- Run this SQL in: Supabase Dashboard → SQL Editor → New Query

-- ── 1. Profiles table (extends auth.users) ──────────────────────────────────
create table if not exists public.profiles (
  id      uuid primary key references auth.users(id) on delete cascade,
  email   text,
  role    text not null default 'user' check (role in ('user', 'admin')),
  plan    text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at timestamp with time zone default now()
);

-- ── 2. User data table ───────────────────────────────────────────────────────
create table if not exists public.user_data (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  data       jsonb not null default '{}',
  updated_at timestamp with time zone default now(),
  unique (user_id)
);

-- ── 3. Auto-create profile on sign-up ───────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 4. Row Level Security ────────────────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table public.user_data enable row level security;

-- Profiles: users see/update only their own row
create policy "users_own_profile_select" on public.profiles
  for select using (auth.uid() = id);

create policy "users_own_profile_update" on public.profiles
  for update using (auth.uid() = id);

-- User data: users can read/write only their own data
create policy "users_own_data_select" on public.user_data
  for select using (auth.uid() = user_id);

create policy "users_own_data_insert" on public.user_data
  for insert with check (auth.uid() = user_id);

create policy "users_own_data_update" on public.user_data
  for update using (auth.uid() = user_id);

create policy "users_own_data_delete" on public.user_data
  for delete using (auth.uid() = user_id);

-- ── 5. Make yourself admin (run ONCE after your first sign-up) ───────────────
-- Replace the email below with your own email, then run this query:
--
-- update public.profiles set role = 'admin'
-- where email = 'your-email@example.com';
