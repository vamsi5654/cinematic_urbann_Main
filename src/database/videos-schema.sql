-- Videos Table for YouTube Portfolio
-- This replaces the image gallery with video portfolio

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,           -- YouTube video ID (extracted from URL)
  category TEXT NOT NULL,            -- Kitchen, Living, Bedroom, Full Home, Bathroom, Office
  title TEXT,                        -- Optional project title
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);

-- Index for sorting by date
CREATE INDEX IF NOT EXISTS idx_videos_created ON videos(created_at DESC);
