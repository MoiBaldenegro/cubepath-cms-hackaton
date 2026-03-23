export enum AuthProvider {
  LOCAL = 'local',
  SUPABASE = 'supabase',
  GOOGLE = 'google',
}

export class UserProvider {
  constructor(readonly value: AuthProvider) {}
}
