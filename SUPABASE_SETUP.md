# 💍 Supabase Setup Guide

Follow these steps to connect your wedding invitation to a real database.

## 1. Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com) and sign up/login.
2.  Click **"New Project"**.
3.  Enter a name (e.g., `wedding-invitation`) and a strong database password.
4.  Select a region close to your guests (e.g., `Europe (Frankfurt)`).
5.  Click **"Create new project"**.

## 2. Run SQL to Create the Database

1.  In your Supabase dashboard, go to the **SQL Editor** (icon on the left sidebar).
2.  Click **"New query"**.
3.  Copy and paste the following SQL code exactly:

```sql
-- Create the RSVPs table
create table public.rsvps (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  phone text,
  status text not null, -- 'yes', 'no', 'maybe'
  party_size integer default 1,
  going_to_reception boolean default false,
  dietary_restrictions text,
  message text
);

-- Enable Row Level Security (RLS)
alter table public.rsvps enable row level security;

-- Allow anyone to INSERT (create) an RSVP
create policy "Enable insert for everyone" on public.rsvps
  for insert with check (true);

-- Allow anyone to READ (select) RSVPs (Required for the Admin Dashboard)
create policy "Enable read for everyone" on public.rsvps
  for select using (true);
```

4.  Click **"Run"** (bottom right). You should see "Success" in the results.

## 3. Get Your API Credentials

1.  Go to **Project Settings** (gear icon) -> **API**.
2.  Find the **Project URL** and copy it.
3.  Find the **anon** / **public** key and copy it.

## 4. Configure Environment Variables

### For Local Development (Optional)
Create a `.env` file in the root of your project:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### For Vercel Deployment (Required)
1.  Go to your project on Vercel.
2.  Click **Settings** -> **Environment Variables**.
3.  Add the following variables:
    *   **Key:** `VITE_SUPABASE_URL`
        **Value:** (Paste your Project URL)
    *   **Key:** `VITE_SUPABASE_ANON_KEY`
        **Value:** (Paste your anon key)
4.  **Redeploy** your project for the changes to take effect.

## 5. Verify It Works

1.  Open your deployed website.
2.  Go to the RSVP section.
3.  Submit a test RSVP.
4.  Go to your Supabase Dashboard -> **Table Editor**.
5.  You should see the new entry in the `rsvps` table!

## 6. Create Settings Table (For Dynamic Content)

To allow the bride and groom to edit the invitation details from the dashboard, run this SQL:

```sql
-- Create the Settings table
create table public.event_settings (
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

-- Enable RLS
alter table public.event_settings enable row level security;

-- Allow everyone to READ settings (so the invitation works)
create policy "Enable read for everyone" on public.event_settings
  for select using (true);

-- Allow authenticated users (Admin Dashboard) to UPDATE settings
create policy "Enable update for authenticated users" on public.event_settings
  for update using (auth.role() = 'authenticated');

-- Insert the default row (ONLY ONE ROW SHOULD EXIST)
insert into public.event_settings (groom_name, bride_name)
values ('Jorge Borges', 'Ana Oliveira');
```
