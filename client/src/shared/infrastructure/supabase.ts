import { createClient } from '@supabase/supabase-js';

// TODO: Move these to .env file in production
const supabaseUrl = 'https://hfxckqkscknxhcdhfckz.supabase.co';
const supabaseKey = 'sb_publishable_avoOvL0SaaJcb9PH_TfLFw_3sQfVjlz';

export const supabase = createClient(supabaseUrl, supabaseKey);