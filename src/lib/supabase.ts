
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use placeholder values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Show warning if using placeholder values
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Using placeholder Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  console.warn('The app will run, but Supabase functionality will not work correctly.');
  console.warn('Connect your project to Supabase using the Supabase integration button in the Lovable interface.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
