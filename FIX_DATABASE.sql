-- 1. Fix 'event_settings' table missing error
create table if not exists public.event_settings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  groom_name text default 'Jorge Borges',
  bride_name text default 'Ana Oliveira',
  wedding_date date default '2026-09-05',
  wedding_time text default '10:00',
  ceremony_location text default 'Santuário do Cristo Rei',
  ceremony_address text default 'Almada, Portugal',
  reception_location text default 'Quinta do Roseiral',
  reception_address text default 'Ericeira, Portugal',
  countdown_target timestamp with time zone default '2026-09-05 10:00:00+01'
);

-- Enable RLS for settings
alter table public.event_settings enable row level security;

-- Allow everyone to READ settings (Fixes 404 Not Found)
create policy "Enable read for everyone" on public.event_settings
  for select using (true);

-- Allow authenticated users (Admin) to UPDATE settings
create policy "Enable update for authenticated users" on public.event_settings
  for update using (auth.role() = 'authenticated');

-- Insert default settings if empty
insert into public.event_settings (groom_name, bride_name)
select 'Jorge Borges', 'Ana Oliveira'
where not exists (select 1 from public.event_settings);


-- 2. Fix 'rsvps' table RLS policy violation (Code 42501)
-- First, ensure the table exists
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  phone text,
  attendance_status text not null, -- Changed from 'status' to match your code
  guest_count integer default 1,   -- Changed from 'party_size' to match your code
  going_to_reception boolean default false,
  dietary_restrictions text,
  message text
);

-- Enable RLS for RSVPs
alter table public.rsvps enable row level security;

-- Drop existing policies to avoid conflicts/duplicates
drop policy if exists "Enable insert for everyone" on public.rsvps;
drop policy if exists "Enable read for everyone" on public.rsvps;

-- Allow anyone to INSERT (Fixes the 42501 error when saving RSVP)
create policy "Enable insert for everyone" on public.rsvps
  for insert with check (true);

-- Allow anyone to READ (Required for Admin Dashboard)
create policy "Enable read for everyone" on public.rsvps
  for select using (true);
