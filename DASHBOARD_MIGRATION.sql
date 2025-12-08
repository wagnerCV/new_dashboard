-- ============================================================================
-- WEDDING DASHBOARD DATABASE MIGRATION
-- ============================================================================
-- Run this in Supabase SQL Editor to set up the dashboard database layer
-- This includes admin authentication, enhanced settings, and analytics tables
-- ============================================================================

-- ============================================================================
-- 1. ADMIN USERS TABLE (Authentication)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('bride', 'groom', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX idx_admin_users_auth_user_id ON public.admin_users(auth_user_id);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_is_active ON public.admin_users(is_active);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can only read their own profile
CREATE POLICY "Admins read own profile" ON public.admin_users
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Policy: Admins can update their own profile
CREATE POLICY "Admins update own profile" ON public.admin_users
  FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- ============================================================================
-- 2. ENHANCED EVENT SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Couple Information
  groom_name TEXT NOT NULL DEFAULT 'Jorge Borges',
  bride_name TEXT NOT NULL DEFAULT 'Ana Oliveira',
  groom_email TEXT,
  bride_email TEXT,
  
  -- Wedding Details
  wedding_date DATE NOT NULL DEFAULT '2026-09-05',
  wedding_time TIME NOT NULL DEFAULT '10:00',
  ceremony_location TEXT NOT NULL DEFAULT 'Santuário do Cristo Rei',
  ceremony_address TEXT NOT NULL DEFAULT 'Almada, Portugal',
  reception_location TEXT NOT NULL DEFAULT 'Quinta do Roseiral',
  reception_address TEXT NOT NULL DEFAULT 'Ericeira, Portugal',
  
  -- Invitation Content
  invitation_message TEXT DEFAULT 'We invite you to celebrate our love and commitment',
  love_manifesto TEXT DEFAULT 'Our love story is about to begin a new chapter',
  dress_code TEXT DEFAULT 'Black Tie',
  rsvp_deadline DATE,
  
  -- Media & Theme
  hero_image_url TEXT,
  background_theme TEXT DEFAULT 'terracotta',
  
  -- Social Links
  instagram_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  website_url TEXT,
  
  -- Metadata
  countdown_target TIMESTAMP WITH TIME ZONE DEFAULT '2026-09-05 10:00:00+01',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL
);

-- Create index for faster lookups
CREATE INDEX idx_event_settings_updated_at ON public.event_settings(updated_at);

-- Enable Row Level Security
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read event settings (for public invitation page)
CREATE POLICY "Public read event settings" ON public.event_settings
  FOR SELECT
  USING (true);

-- Policy: Only authenticated admins can update event settings
CREATE POLICY "Admin update event settings" ON public.event_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.auth_user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Insert default settings if table is empty
INSERT INTO public.event_settings (groom_name, bride_name)
SELECT 'Jorge Borges', 'Ana Oliveira'
WHERE NOT EXISTS (SELECT 1 FROM public.event_settings);

-- ============================================================================
-- 3. TIMELINE STORIES TABLE (Editable couple's story)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.timeline_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL CHECK (icon_name IN ('heart', 'map-pin', 'calendar', 'gem', 'star', 'ring')),
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_timeline_stories_display_order ON public.timeline_stories(display_order);

-- Enable Row Level Security
ALTER TABLE public.timeline_stories ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read timeline stories (for public invitation page)
CREATE POLICY "Public read timeline stories" ON public.timeline_stories
  FOR SELECT
  USING (true);

-- Policy: Only authenticated admins can manage timeline stories
CREATE POLICY "Admin manage timeline stories" ON public.timeline_stories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.auth_user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Insert default timeline stories if table is empty
INSERT INTO public.timeline_stories (year, title, description, icon_name, display_order)
SELECT '2018', 'Como nos conhecemos', 'Um café casual em Lisboa transformou-se numa conversa de horas. Sabíamos logo que havia algo especial.', 'heart', 1
WHERE NOT EXISTS (SELECT 1 FROM public.timeline_stories WHERE year = '2018');

INSERT INTO public.timeline_stories (year, title, description, icon_name, display_order)
SELECT '2019', 'O primeiro encontro', 'Um passeio ao pôr-do-sol na Costa da Caparica. O início oficial da nossa aventura juntos.', 'map-pin', 2
WHERE NOT EXISTS (SELECT 1 FROM public.timeline_stories WHERE year = '2019');

INSERT INTO public.timeline_stories (year, title, description, icon_name, display_order)
SELECT '2024', 'O pedido', 'Numa viagem inesquecível, sob as estrelas, a pergunta mais importante foi feita. A resposta foi um ''Sim'' emocionado.', 'gem', 3
WHERE NOT EXISTS (SELECT 1 FROM public.timeline_stories WHERE year = '2024');

INSERT INTO public.timeline_stories (year, title, description, icon_name, display_order)
SELECT '2026', 'O grande dia', 'Onde prometemos amor eterno diante de todos os que mais amamos. O começo do nosso ''para sempre''.', 'calendar', 4
WHERE NOT EXISTS (SELECT 1 FROM public.timeline_stories WHERE year = '2026');

-- ============================================================================
-- 4. ENHANCED RSVPS TABLE (Guest responses)
-- ============================================================================

-- Modify existing rsvps table to add admin-related fields if they don't exist
ALTER TABLE public.rsvps 
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS response_source TEXT DEFAULT 'web' CHECK (response_source IN ('web', 'phone', 'manual'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON public.rsvps(status);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at);
CREATE INDEX IF NOT EXISTS idx_rsvps_name ON public.rsvps(name);

-- Update RLS policies for rsvps table (if not already set)
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.rsvps;
DROP POLICY IF EXISTS "Enable read for everyone" ON public.rsvps;
DROP POLICY IF EXISTS "Enable update for everyone" ON public.rsvps;

-- Policy: Public can insert RSVPs
CREATE POLICY "Public insert rsvp" ON public.rsvps
  FOR INSERT
  WITH CHECK (true);

-- Policy: Public can read RSVPs (needed for admin dashboard)
CREATE POLICY "Public read rsvps" ON public.rsvps
  FOR SELECT
  USING (true);

-- Policy: Only authenticated admins can update RSVPs
CREATE POLICY "Admin update rsvp" ON public.rsvps
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.auth_user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- ============================================================================
-- 5. TRIGGER FUNCTIONS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admin_users table
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for event_settings table
DROP TRIGGER IF EXISTS update_event_settings_updated_at ON public.event_settings;
CREATE TRIGGER update_event_settings_updated_at
  BEFORE UPDATE ON public.event_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for timeline_stories table
DROP TRIGGER IF EXISTS update_timeline_stories_updated_at ON public.timeline_stories;
CREATE TRIGGER update_timeline_stories_updated_at
  BEFORE UPDATE ON public.timeline_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for rsvps table
DROP TRIGGER IF EXISTS update_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER update_rsvps_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. HELPER FUNCTIONS FOR DASHBOARD
-- ============================================================================

-- Function to get RSVP statistics
CREATE OR REPLACE FUNCTION get_rsvp_stats()
RETURNS TABLE (
  total_guests BIGINT,
  confirmed_guests BIGINT,
  pending_guests BIGINT,
  declined_guests BIGINT,
  total_expected_attendees BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_guests,
    COUNT(*) FILTER (WHERE status = 'yes')::BIGINT as confirmed_guests,
    COUNT(*) FILTER (WHERE status = 'maybe')::BIGINT as pending_guests,
    COUNT(*) FILTER (WHERE status = 'no')::BIGINT as declined_guests,
    COALESCE(SUM(CASE WHEN status = 'yes' THEN party_size ELSE 0 END), 0)::BIGINT as total_expected_attendees
  FROM public.rsvps;
END;
$$ LANGUAGE plpgsql;

-- Function to get RSVP status distribution
CREATE OR REPLACE FUNCTION get_rsvp_distribution()
RETURNS TABLE (
  status TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT rsvps.status, COUNT(*)::BIGINT
  FROM public.rsvps
  GROUP BY rsvps.status
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created
SELECT 
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('admin_users', 'event_settings', 'timeline_stories', 'rsvps')
ORDER BY tablename;

-- ============================================================================
-- NOTES FOR SETUP
-- ============================================================================
-- 1. After running this migration, create Supabase Auth users for bride and groom
-- 2. Then insert them into admin_users table with their auth.users IDs
-- 3. Example insert (after creating auth users):
--    INSERT INTO public.admin_users (auth_user_id, email, full_name, role)
--    VALUES ('{auth_user_id}', 'bride@example.com', 'Ana Oliveira', 'bride');
-- 4. Enable RLS on all tables (already done in this migration)
-- 5. Test RLS policies by querying as different roles
-- ============================================================================
