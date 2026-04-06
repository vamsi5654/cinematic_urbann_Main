// TypeScript types for The Urbann

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  createdAt: Date;
}

export interface Customer {
  customerNumber: string; // Document ID
  category: 'Kitchen' | 'Living' | 'Bedroom' | 'Full Home' | 'Bathroom' | 'Office';
  media: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Video Portfolio Item
export interface VideoItem {
  id: string;
  videoId: string; // YouTube video ID
  category: 'Kitchen' | 'Living' | 'Bedroom' | 'Full Home' | 'Bathroom' | 'Office';
  title?: string; // Optional project title
  createdAt: Date;
  updatedAt?: Date;
}

// Image Portfolio Item (NEW - for R2 storage)
export interface ImageItem {
  id: string;
  imageUrl: string; // Full R2 URL
  fileName: string; // R2 file path/name
  category: 'Kitchen' | 'Living' | 'Bedroom' | 'Bathroom';
  title?: string; // Optional project title
  fileSize: number; // In bytes
  createdAt: Date;
  updatedAt?: Date;
}

export interface Project {
  id: string;
  title: string;
  category: 'Kitchen' | 'Living' | 'Bedroom' | 'Full Home' | 'Bathroom' | 'Office';
  imageUrl: string;
  videoUrl?: string; // Video preview for gallery
  images: string[];
  location: string;
  year: string;
  area: string;
  materials: string[];
  description: string;
  tags: string[];
  featured: boolean;
  beforeImage?: string;
  afterImage?: string;
}

// Legacy type for backward compatibility
export interface ImageUpload {
  id: string;
  imageUrl: string;
  videoUrl?: string; // Video for project preview
  publicId: string;
  customerNumber: string;
  customerName: string;
  phone: string;
  category: string;
  tags: string[];
  description?: string;
  uploadedAt: Date;
  uploadedBy: string;
  status: 'draft' | 'published';
  projectId?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
  status?: 'new' | 'read' | 'responded';
  readStatus?: boolean;
  createdAt: Date;
  submittedAt?: Date;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}