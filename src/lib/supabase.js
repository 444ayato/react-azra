import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jfpzpwowhuaewxkkxooj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8UYDCCB2kUYQVGE0gMIwnA_6ngP9JmU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export default supabase;
