import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Edge Analytics: Supabase URL or Anon Key is missing! Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
