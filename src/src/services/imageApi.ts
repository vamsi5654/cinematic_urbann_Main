/**
 * ================================================================
 * IMAGE API SERVICE (Supabase Integration)
 * ================================================================
 * Manages image metadata in Supabase database
 * Actual images are stored in Cloudflare R2
 * 
 * Database Table: portfolio_images
 * Columns: id, image_url, file_name, category, title, file_size, created_at
 * ================================================================
 */

import { supabase } from '../lib/supabaseClient';
import { ImageItem } from '../types';

// ================================================================
// MOCK DATA (for development without Supabase)
// ================================================================
const MOCK_IMAGES: ImageItem[] = [
  {
    id: 'mock-img-1',
    imageUrl: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800',
    fileName: 'kitchen/mock-1.webp',
    category: 'Kitchen',
    title: 'Modern Kitchen Design',
    fileSize: 245000,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'mock-img-2',
    imageUrl: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
    fileName: 'kitchen/mock-2.webp',
    category: 'Kitchen',
    title: 'Luxury Kitchen Interior',
    fileSize: 312000,
    createdAt: new Date('2024-03-14'),
  },
  {
    id: 'mock-img-3',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
    fileName: 'living/mock-3.webp',
    category: 'Living',
    title: 'Cozy Living Room',
    fileSize: 289000,
    createdAt: new Date('2024-03-13'),
  },
  {
    id: 'mock-img-4',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    fileName: 'living/mock-4.webp',
    category: 'Living',
    title: 'Contemporary Living Space',
    fileSize: 267000,
    createdAt: new Date('2024-03-12'),
  },
  {
    id: 'mock-img-5',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    fileName: 'bedroom/mock-5.webp',
    category: 'Bedroom',
    title: 'Master Bedroom Suite',
    fileSize: 234000,
    createdAt: new Date('2024-03-11'),
  },
  {
    id: 'mock-img-6',
    imageUrl: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800',
    fileName: 'bedroom/mock-6.webp',
    category: 'Bedroom',
    title: 'Minimalist Bedroom',
    fileSize: 256000,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'mock-img-7',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
    fileName: 'bathroom/mock-7.webp',
    category: 'Bathroom',
    title: 'Spa Bathroom',
    fileSize: 298000,
    createdAt: new Date('2024-03-09'),
  },
  {
    id: 'mock-img-8',
    imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800',
    fileName: 'bathroom/mock-8.webp',
    category: 'Bathroom',
    title: 'Modern Bathroom Design',
    fileSize: 276000,
    createdAt: new Date('2024-03-08'),
  },
];

// Store for mock mode (localStorage)
const STORAGE_KEY = 'urbann_images';

// ================================================================
// HELPER FUNCTIONS
// ================================================================

/**
 * Check if Supabase is available
 */
function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

/**
 * Get images from localStorage (mock mode)
 */
function getImagesFromStorage(): ImageItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  }
  // Return mock data on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_IMAGES));
  return MOCK_IMAGES;
}

/**
 * Save images to localStorage (mock mode)
 */
function saveImagesToStorage(images: ImageItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

// ================================================================
// API FUNCTIONS
// ================================================================

/**
 * Get all images (optionally filtered by category)
 */
export async function getImages(category?: string): Promise<ImageItem[]> {
  try {
    // MOCK MODE: Use localStorage
    if (!isSupabaseAvailable()) {
      console.log('🧪 Mock mode: Getting images from localStorage');
      const allImages = getImagesFromStorage();
      
      if (category && category !== 'All') {
        return allImages.filter(img => img.category === category);
      }
      
      return allImages;
    }

    // REAL MODE: Use Supabase
    let query = supabase!
      .from('portfolio_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching images:', error);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      imageUrl: item.image_url,
      fileName: item.file_name,
      category: item.category,
      title: item.title,
      fileSize: item.file_size,
      createdAt: new Date(item.created_at),
      updatedAt: item.updated_at ? new Date(item.updated_at) : undefined,
    }));

  } catch (error) {
    console.error('Error in getImages:', error);
    return [];
  }
}

/**
 * Get single image by ID
 */
export async function getImageById(id: string): Promise<ImageItem | null> {
  try {
    // MOCK MODE
    if (!isSupabaseAvailable()) {
      const allImages = getImagesFromStorage();
      return allImages.find(img => img.id === id) || null;
    }

    // REAL MODE
    const { data, error } = await supabase!
      .from('portfolio_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching image:', error);
      return null;
    }

    return {
      id: data.id,
      imageUrl: data.image_url,
      fileName: data.file_name,
      category: data.category,
      title: data.title,
      fileSize: data.file_size,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };

  } catch (error) {
    console.error('Error in getImageById:', error);
    return null;
  }
}

/**
 * Create new image record
 */
export async function createImage(imageData: Omit<ImageItem, 'id' | 'createdAt'>): Promise<ImageItem | null> {
  try {
    console.log('💾 Creating image record:', {
      category: imageData.category,
      title: imageData.title,
      fileName: imageData.fileName,
      fileSize: imageData.fileSize,
      imageUrlLength: imageData.imageUrl.length,
      isBase64: imageData.imageUrl.startsWith('data:')
    });
    
    // MOCK MODE
    if (!isSupabaseAvailable()) {
      console.log('🧪 Mock mode: Creating image in localStorage');
      
      const newImage: ImageItem = {
        ...imageData,
        id: `img-${Date.now()}`,
        createdAt: new Date(),
      };

      const allImages = getImagesFromStorage();
      allImages.unshift(newImage);
      saveImagesToStorage(allImages);
      
      console.log('✅ Image saved to localStorage:', newImage.id);

      return newImage;
    }

    // REAL MODE
    const { data, error } = await supabase!
      .from('portfolio_images')
      .insert([
        {
          image_url: imageData.imageUrl,
          file_name: imageData.fileName,
          category: imageData.category,
          title: imageData.title,
          file_size: imageData.fileSize,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating image:', error);
      throw error;
    }
    
    console.log('✅ Image saved to Supabase:', data.id);

    return {
      id: data.id,
      imageUrl: data.image_url,
      fileName: data.file_name,
      category: data.category,
      title: data.title,
      fileSize: data.file_size,
      createdAt: new Date(data.created_at),
    };

  } catch (error) {
    console.error('Error in createImage:', error);
    return null;
  }
}

/**
 * Update existing image
 */
export async function updateImage(id: string, updates: Partial<ImageItem>): Promise<boolean> {
  try {
    // MOCK MODE
    if (!isSupabaseAvailable()) {
      console.log('🧪 Mock mode: Updating image in localStorage');
      
      const allImages = getImagesFromStorage();
      const index = allImages.findIndex(img => img.id === id);
      
      if (index === -1) return false;

      allImages[index] = {
        ...allImages[index],
        ...updates,
        updatedAt: new Date(),
      };

      saveImagesToStorage(allImages);
      return true;
    }

    // REAL MODE
    const updateData: any = {};
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;
    if (updates.fileName) updateData.file_name = updates.fileName;
    if (updates.category) updateData.category = updates.category;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.fileSize) updateData.file_size = updates.fileSize;

    const { error } = await supabase!
      .from('portfolio_images')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating image:', error);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error in updateImage:', error);
    return false;
  }
}

/**
 * Delete image record (note: actual R2 file must be deleted separately)
 */
export async function deleteImage(id: string): Promise<boolean> {
  try {
    // MOCK MODE
    if (!isSupabaseAvailable()) {
      console.log('🧪 Mock mode: Deleting image from localStorage');
      
      const allImages = getImagesFromStorage();
      const filtered = allImages.filter(img => img.id !== id);
      
      if (filtered.length === allImages.length) {
        return false; // Image not found
      }

      saveImagesToStorage(filtered);
      return true;
    }

    // REAL MODE
    const { error } = await supabase!
      .from('portfolio_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * Get images count by category
 */
export async function getImagesCountByCategory(): Promise<Record<string, number>> {
  try {
    const allImages = await getImages();
    
    const counts: Record<string, number> = {
      All: allImages.length,
      Kitchen: 0,
      Living: 0,
      Bedroom: 0,
      Bathroom: 0,
    };

    allImages.forEach(img => {
      counts[img.category] = (counts[img.category] || 0) + 1;
    });

    return counts;

  } catch (error) {
    console.error('Error in getImagesCountByCategory:', error);
    return { All: 0, Kitchen: 0, Living: 0, Bedroom: 0, Bathroom: 0 };
  }
}