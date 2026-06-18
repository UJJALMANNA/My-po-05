-- ============================================================
-- BLOG SCHEMA — run this in your Supabase SQL editor
-- (Project → SQL Editor → New query → paste → Run)
--
-- This adds a "posts" table for user-submitted blogs/theses.
-- New posts are created with status = 'pending' and are NOT
-- visible to the public until you approve them on admin.html.
-- ============================================================

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  title text not null,
  content text not null,
  status text not null default 'pending',  -- 'pending' or 'approved'
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.posts enable row level security;

-- Anyone (anon key) can SUBMIT a new post — always created as 'pending'
create policy "Allow public insert"
on public.posts
for insert
to anon
with check (status = 'pending');

-- Anyone can READ only posts that are already approved
create policy "Allow public read of approved posts"
on public.posts
for select
to anon
using (status = 'approved');

-- ⚠️ IMPORTANT: There is intentionally NO public policy allowing
-- update or delete. Only you, using the Supabase dashboard's
-- service role (or the admin page below using your service key),
-- can approve or delete posts. This keeps moderation safe.
