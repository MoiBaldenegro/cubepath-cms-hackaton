import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hfxckqkscknxhcdhfckz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_avoOvL0SaaJcb9PH_TfLFw_3sQfVjlz';

export const supabase = createClient(supabaseUrl, supabaseKey);