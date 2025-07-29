import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://rzoypvhfkzphdtqrrvtz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6b3lwdmhma3pwaGR0cXJydnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3Mjk0MzMsImV4cCI6MjA2OTMwNTQzM30.0PPNYXCk3dHdGWhf0eE4a-W91Z7XsfWLbXcrAevmmK4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
