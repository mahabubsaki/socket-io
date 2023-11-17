import { createClient } from '@supabase/supabase-js';
const supabse = createClient(import.meta.env.VITE_SUPABASE_PROJECT_URL, import.meta.env.VITE_SUPABASE_PROJECT_API_KEY);
export default supabse;