// Mock Video API for Local Development
// This runs in-browser when Cloudflare Workers backend is not available

import { VideoItem } from '../../types/index';

// LocalStorage key
const STORAGE_KEY = 'urbann_mock_videos';

// Get videos from localStorage or use default samples
function getStoredVideos(): VideoItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((v: any) => ({
        ...v,
        createdAt: new Date(v.createdAt),
        updatedAt: v.updatedAt ? new Date(v.updatedAt) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error loading videos from storage:', error);
  }
  
  // Return default samples if nothing in storage
  return [
    {
      id: '1',
      videoId: 'zNTaVTMoNTE',
      category: 'Kitchen',
      title: 'Modern Kitchen Transformation',
      createdAt: new Date('2024-03-01'),
    },
    {
      id: '2',
      videoId: 'Zi_XLOBDo_Y',
      category: 'Living',
      title: 'Luxury Living Room Design',
      createdAt: new Date('2024-03-05'),
    },
    {
      id: '3',
      videoId: 'QORDGN-ly7g',
      category: 'Bedroom',
      title: 'Serene Bedroom Makeover',
      createdAt: new Date('2024-03-10'),
    },
  ];
}

// Save videos to localStorage
function saveVideos(videos: VideoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (error) {
    console.error('Error saving videos to storage:', error);
  }
}

// In-memory storage that syncs with localStorage
let mockVideos: VideoItem[] = getStoredVideos();

export const mockVideoApi = {
  // Create video
  async createVideo(data: {
    videoUrl: string;
    category: string;
    title?: string;
  }): Promise<VideoItem> {
    // Extract video ID from URL (same logic as main API)
    const videoId = extractYouTubeVideoId(data.videoUrl);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const newVideo: VideoItem = {
      id: Math.random().toString(36).substr(2, 9),
      videoId,
      category: data.category,
      title: data.title,
      createdAt: new Date(),
    };

    mockVideos.unshift(newVideo);
    saveVideos(mockVideos); // Persist to localStorage
    console.log('✅ Mock API: Created video', newVideo);
    
    return newVideo;
  },

  // Get videos
  async getVideos(filters?: { category?: string }): Promise<VideoItem[]> {
    console.log('✅ Mock API: Fetching videos', filters);
    
    // Reload from storage to ensure we have latest data
    mockVideos = getStoredVideos();
    
    let filtered = [...mockVideos];
    
    if (filters?.category && filters.category !== 'All') {
      filtered = filtered.filter(v => v.category === filters.category);
    }
    
    return filtered;
  },

  // Delete video
  async deleteVideo(videoId: string): Promise<void> {
    console.log('✅ Mock API: Deleting video', videoId);
    mockVideos = mockVideos.filter(v => v.id !== videoId);
    saveVideos(mockVideos); // Persist to localStorage
  },

  // Update video
  async updateVideo(
    id: string,
    updates: { category?: string; title?: string }
  ): Promise<void> {
    console.log('✅ Mock API: Updating video', id, updates);
    const index = mockVideos.findIndex(v => v.id === id);
    if (index !== -1) {
      mockVideos[index] = {
        ...mockVideos[index],
        ...updates,
        updatedAt: new Date(),
      };
      saveVideos(mockVideos); // Persist to localStorage
    }
  },
};

// Helper function to extract YouTube video ID
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}