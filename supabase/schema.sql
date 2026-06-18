-- ============================================================
-- SUPABASE SCHEMA — run this once in your Supabase project's
-- SQL editor (Project → SQL Editor → New query → paste → Run)
-- ============================================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default 'General',
  message text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Allow anyone (anon key) to INSERT a new message — this is what
-- the public query form on the website needs.
create policy "Allow public insert"
on public.messages
for insert
to anon
with check (true);

-- Do NOT allow public SELECT/UPDATE/DELETE — only the project
-- owner (via the Supabase dashboard, using the service role) can
-- read or manage messages. This keeps submitted messages private.
