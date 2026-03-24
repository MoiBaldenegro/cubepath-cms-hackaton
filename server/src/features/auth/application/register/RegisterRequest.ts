export interface RegisterRequest {
  email: string;
  password: string;
  provider?: 'local' | 'supabase';
}
