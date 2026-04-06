-- The Urbann Interior Design - Supabase Database Schema
-- Copy and paste this entire file into Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== VIDEOS TABLE ====================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- ==================== CONTACT SUBMISSIONS TABLE ====================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at DESC);

-- ==================== SCHEDULED EVENTS TABLE ====================
CREATE TABLE IF NOT EXISTS scheduled_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  service_type TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for event management
CREATE INDEX IF NOT EXISTS idx_events_date ON scheduled_events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON scheduled_events(status);

-- ==================== ADMIN USERS TABLE ====================
-- Note: This table is created for reference, but we'll use Supabase Auth instead
-- You can create admin users directly in Supabase Auth dashboard

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Videos: Public read access, authenticated write access
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos"
  ON videos FOR DELETE
  USING (auth.role() = 'authenticated');

-- Contact Submissions: Anyone can submit, only authenticated can read
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Scheduled Events: Anyone can create, only authenticated can manage
CREATE POLICY "Anyone can schedule events"
  ON scheduled_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view events"
  ON scheduled_events FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update events"
  ON scheduled_events FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete events"
  ON scheduled_events FOR DELETE
  USING (auth.role() = 'authenticated');

-- Admin Users: Only viewable by authenticated users
CREATE POLICY "Only authenticated users can view admin users"
  ON admin_users FOR SELECT
  USING (auth.role() = 'authenticated');

-- ==================== SAMPLE DATA (OPTIONAL) ====================

-- Insert sample videos (you can remove these after testing)
INSERT INTO videos (video_id, category, title) VALUES
  ('zNTaVTMoNTE', 'Kitchen', 'Modern Kitchen Transformation'),
  ('Zi_XLOBDo_Y', 'Living', 'Luxury Living Room Design'),
  ('QORDGN-ly7g', 'Bedroom', 'Serene Bedroom Makeover')
ON CONFLICT DO NOTHING;

-- ==================== COMPLETED ====================
-- Database setup complete! 
-- Next steps:
-- 1. Create an admin user in Supabase Auth dashboard
-- 2. Copy your Supabase URL and Anon Key to .env file
-- 3. Start using the application!
