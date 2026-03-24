import { createClient } from '@supabase/supabase-js';
import { config } from './config';
//force

const supabaseUrl = config.VITE_SUPABASE_URL || '';
const supabaseKey = config.VITE_SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);