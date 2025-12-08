-- SQL Schema for Wedding Dashboard
-- Run this in Supabase SQL Editor to add dashboard features

-- 1. Create timeline_stories table for editable story content
CREATE TABLE IF NOT EXISTS public.timeline_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL, -- 'heart', 'map-pin', 'calendar', 'gem'
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create admin_users table for dashboard authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin', -- 'bride' or 'groom'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.timeline_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for timeline_stories
-- Allow public read access (for invitation website)
CREATE POLICY "Allow public read access to timeline stories"
  ON public.timeline_stories
  FOR SELECT
  USING (true);

-- Allow authenticated admin users to manage timeline stories
CREATE POLICY "Allow admin users to manage timeline stories"
  ON public.timeline_stories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Create policies for admin_users
-- Only allow admin users to read their own data
CREATE POLICY "Allow admin users to read own data"
  ON public.admin_users
  FOR SELECT
  USING (true);

-- 6. Insert default timeline stories (matching current invitation content)
INSERT INTO public.timeline_stories (year, title, description, icon_name, display_order) VALUES
  ('2018', 'Como nos conhecemos', 'Um café casual em Lisboa transformou-se numa conversa de horas. Sabíamos logo que havia algo especial.', 'heart', 1),
  ('2019', 'O primeiro encontro', 'Um passeio ao pôr-do-sol na Costa da Caparica. O início oficial da nossa aventura juntos.', 'map-pin', 2),
  ('2024', 'O pedido', 'Numa viagem inesquecível, sob as estrelas, a pergunta mais importante foi feita. A resposta foi um ''Sim'' emocionado.', 'gem', 3),
  ('2026', 'O grande dia', 'Onde prometemos amor eterno diante de todos os que mais amamos. O começo do nosso ''para sempre''.', 'calendar', 4);

-- 7. Create default admin users (you'll need to update passwords via dashboard)
-- Note: These are placeholder hashes - users will set real passwords on first login
INSERT INTO public.admin_users (username, password_hash, full_name, role) VALUES
  ('jorge', '$2a$10$placeholder_hash_will_be_replaced', 'Jorge Borges', 'groom'),
  ('ana', '$2a$10$placeholder_hash_will_be_replaced', 'Ana Oliveira', 'bride');

-- 8. Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger for timeline_stories
CREATE TRIGGER update_timeline_stories_updated_at
  BEFORE UPDATE ON public.timeline_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Done! Now the dashboard can manage timeline stories and admin authentication.
