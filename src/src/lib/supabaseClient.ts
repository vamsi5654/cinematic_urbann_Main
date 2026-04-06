import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using mock API for development.');
}

// Only create client if credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string;
          video_id: string;
          category: string;
          title: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          video_id: string;
          category: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          video_id?: string;
          category?: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: string;
          created_at: string;
        };
      };
      scheduled_events: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          event_date: string;
          event_time: string;
          service_type: string;
          notes: string | null;
          status: string;
          created_at: string;
        };
      };
    };
  };
}