-- Migration: Add missing columns to images table
-- Run this on your D1 database to fix the schema mismatch

-- Add project_id column if it doesn't exist
ALTER TABLE images ADD COLUMN project_id TEXT;

-- Add video_url column if it doesn't exist (for video support)
ALTER TABLE images ADD COLUMN video_url TEXT;

-- Add before/after image columns if they don't exist
ALTER TABLE images ADD COLUMN before_image_url TEXT;
ALTER TABLE images ADD COLUMN after_image_url TEXT;

-- Note: SQLite doesn't support "IF NOT EXISTS" for ALTER TABLE
-- If you get "duplicate column name" errors, it means the column already exists
-- You can safely ignore those errors
