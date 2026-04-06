-- ================================================================
-- MIGRATION 003: Create Portfolio Images Table
-- ================================================================
-- Creates table for storing image metadata
-- Actual images are stored in Cloudflare R2
-- 
-- Run this in Supabase SQL Editor:
-- 1. Go to Supabase Dashboard
-- 2. Click "SQL Editor" in sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file
-- 5. Click "Run" button
-- ================================================================

-- Create portfolio_images table
CREATE TABLE IF NOT EXISTS portfolio_images (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Image Data
  image_url TEXT NOT NULL,                    -- Full R2 public URL
  file_name TEXT NOT NULL,                    -- R2 file path (e.g., "kitchen/abc123.webp")
  category TEXT NOT NULL,                     -- Kitchen, Living, Bedroom, Bathroom
  title TEXT,                                 -- Optional project title
  file_size INTEGER NOT NULL DEFAULT 0,       -- File size in bytes
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_category CHECK (category IN ('Kitchen', 'Living', 'Bedroom', 'Bathroom')),
  CONSTRAINT positive_file_size CHECK (file_size >= 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_images_category ON portfolio_images(category);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON portfolio_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_file_name ON portfolio_images(file_name);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Allow public READ access (anyone can view images)
CREATE POLICY "Allow public read access"
  ON portfolio_images
  FOR SELECT
  TO public
  USING (true);

-- 2. Allow authenticated users to INSERT (admin only in practice)
CREATE POLICY "Allow authenticated insert"
  ON portfolio_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. Allow authenticated users to UPDATE (admin only in practice)
CREATE POLICY "Allow authenticated update"
  ON portfolio_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Allow authenticated users to DELETE (admin only in practice)
CREATE POLICY "Allow authenticated delete"
  ON portfolio_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER set_images_updated_at
  BEFORE UPDATE ON portfolio_images
  FOR EACH ROW
  EXECUTE FUNCTION update_images_updated_at();

-- ================================================================
-- SEED DATA (Optional - for testing)
-- ================================================================
-- Uncomment to add sample data:

/*
INSERT INTO portfolio_images (image_url, file_name, category, title, file_size) VALUES
  ('https://pub-bb51c92ec25541b7bac2969eeb40169b.r2.dev/kitchen/sample1.webp', 'kitchen/sample1.webp', 'Kitchen', 'Modern Kitchen Design', 245000),
  ('https://pub-bb51c92ec25541b7bac2969eeb40169b.r2.dev/living/sample2.webp', 'living/sample2.webp', 'Living', 'Cozy Living Room', 289000),
  ('https://pub-bb51c92ec25541b7bac2969eeb40169b.r2.dev/bedroom/sample3.webp', 'bedroom/sample3.webp', 'Bedroom', 'Master Bedroom Suite', 234000),
  ('https://pub-bb51c92ec25541b7bac2969eeb40169b.r2.dev/bathroom/sample4.webp', 'bathroom/sample4.webp', 'Bathroom', 'Spa Bathroom', 298000);
*/

-- ================================================================
-- VERIFY INSTALLATION
-- ================================================================
-- Run this to check if table was created successfully:
-- SELECT * FROM portfolio_images LIMIT 5;

-- ================================================================
-- SUCCESS! ✅
-- ================================================================
-- Table "portfolio_images" created successfully
-- Ready to store image metadata
-- Actual images will be stored in Cloudflare R2
-- ================================================================
