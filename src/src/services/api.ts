import { ImageUpload, ContactFormData, ContactSubmission, ScheduledEvent, Customer, VideoItem } from '../../types/index';
import { supabase } from '../lib/supabaseClient';
import { mockVideoApi } from './mockVideoApi';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return supabase !== null && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};

// Auth token management (for admin access)
let authToken: string | null = localStorage.getItem('auth_token');

export function isAuthenticated(): boolean {
  return !!authToken;
}

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('auth_token', token);
}

export function logout() {
  authToken = null;
  localStorage.removeItem('auth_token');
  if (supabase) {
    supabase.auth.signOut();
  }
}

// Admin login
export async function login(username: string, password: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    // Mock login for development
    if (username === 'admin' && password === 'admin') {
      setAuthToken('demo-token');
      return;
    }
    throw new Error('Invalid credentials');
  }

  // Use Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });

  if (error) throw error;
  if (data.session) {
    setAuthToken(data.session.access_token);
  }
}

// ==================== VIDEO API ====================

// Extract YouTube video ID from various URL formats
export function extractYouTubeVideoId(url: string): string | null {
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

// Generate YouTube embed URL with autoplay parameters
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: '1', // Required for autoplay
    loop: '1',
    playlist: videoId, // Required for loop to work
    controls: '1',
    modestbranding: '1',
    rel: '0',
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

// Create a new video
export async function createVideo(data: {
  videoUrl: string;
  category: string;
  title?: string;
}): Promise<VideoItem> {
  const videoId = extractYouTubeVideoId(data.videoUrl);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL. Please provide a valid YouTube video link.');
  }

  if (!isSupabaseConfigured()) {
    return await mockVideoApi.createVideo(data);
  }

  const { data: video, error } = await supabase
    .from('videos')
    .insert({
      video_id: videoId,
      category: data.category,
      title: data.title || null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: video.id,
    videoId: video.video_id,
    category: video.category,
    title: video.title || undefined,
    createdAt: new Date(video.created_at),
    updatedAt: video.updated_at ? new Date(video.updated_at) : undefined,
  };
}

// Get all videos with optional category filter
export async function getVideos(filters?: {
  category?: string;
}): Promise<VideoItem[]> {
  if (!isSupabaseConfigured()) {
    return await mockVideoApi.getVideos(filters);
  }

  let query = supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error, falling back to mock API:', error);
    return await mockVideoApi.getVideos(filters);
  }

  return (data || []).map((video) => ({
    id: video.id,
    videoId: video.video_id,
    category: video.category,
    title: video.title || undefined,
    createdAt: new Date(video.created_at),
    updatedAt: video.updated_at ? new Date(video.updated_at) : undefined,
  }));
}

// Delete a video
export async function deleteVideo(videoId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    return await mockVideoApi.deleteVideo(videoId);
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId);

  if (error) throw error;
}

// Update a video
export async function updateVideo(
  id: string,
  updates: {
    category?: string;
    title?: string;
  }
): Promise<void> {
  if (!isSupabaseConfigured()) {
    return await mockVideoApi.updateVideo(id, updates);
  }

  const { error } = await supabase
    .from('videos')
    .update({
      category: updates.category,
      title: updates.title || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

// ==================== CONTACT FORM API ====================

export async function submitContactForm(data: ContactFormData): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('Mock: Contact form submitted', data);
    return;
  }

  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      status: 'new',
    });

  if (error) throw error;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((submission) => ({
    id: submission.id,
    name: submission.name,
    email: submission.email,
    phone: submission.phone || undefined,
    message: submission.message,
    status: submission.status as 'new' | 'read' | 'responded',
    createdAt: new Date(submission.created_at),
  }));
}

export async function updateContactStatus(
  id: string,
  status: 'new' | 'read' | 'responded'
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

// ==================== EVENTS API ====================

export async function scheduleEvent(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  serviceType: string;
  notes?: string;
}): Promise<ScheduledEvent> {
  if (!isSupabaseConfigured()) {
    return {
      id: Math.random().toString(),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      serviceType: data.serviceType,
      notes: data.notes,
      status: 'pending',
      createdAt: new Date(),
    };
  }

  const { data: event, error } = await supabase
    .from('scheduled_events')
    .insert({
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      event_date: data.eventDate,
      event_time: data.eventTime,
      service_type: data.serviceType,
      notes: data.notes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: event.id,
    customerName: event.customer_name,
    customerEmail: event.customer_email,
    customerPhone: event.customer_phone,
    eventDate: event.event_date,
    eventTime: event.event_time,
    serviceType: event.service_type,
    notes: event.notes || undefined,
    status: event.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    createdAt: new Date(event.created_at),
  };
}

export async function getScheduledEvents(): Promise<ScheduledEvent[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('scheduled_events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) throw error;

  return (data || []).map((event) => ({
    id: event.id,
    customerName: event.customer_name,
    customerEmail: event.customer_email,
    customerPhone: event.customer_phone,
    eventDate: event.event_date,
    eventTime: event.event_time,
    serviceType: event.service_type,
    notes: event.notes || undefined,
    status: event.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    createdAt: new Date(event.created_at),
  }));
}

export async function updateEventStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase
    .from('scheduled_events')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteEvent(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase
    .from('scheduled_events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== ACTIVE EVENTS API (for EventPopup) ====================

export interface ActiveEvent {
  id: string;
  title: string;
  message: string;
  image_url?: string;
  scheduled_date: string;
  scheduled_time: string;
}

// Get active events for today (for event popup notifications)
export async function getActiveEvents(): Promise<ActiveEvent[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const { data, error } = await supabase
    .from('active_events')
    .select('*')
    .eq('scheduled_date', today)
    .eq('is_active', true)
    .order('scheduled_time', { ascending: true });

  if (error) {
    console.error('Error fetching active events:', error);
    return [];
  }

  return (data || []).map((event) => ({
    id: event.id,
    title: event.title,
    message: event.message,
    image_url: event.image_url || undefined,
    scheduled_date: event.scheduled_date,
    scheduled_time: event.scheduled_time,
  }));
}