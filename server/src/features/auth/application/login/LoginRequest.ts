export interface LoginRequest {
  email: string;
  password: string;
  provider?: 'local' | 'supabase';
}
