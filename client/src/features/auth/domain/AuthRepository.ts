export interface User {
    id: string;
    email: string;
    token?: string;
    role?: string;
    provider?: string;
    organizationId?: string;
}

export interface AuthRepository {
    login(email: string, password: string, provider?: 'local' | 'supabase'): Promise<User>;
    register(email: string, password: string, provider?: 'local' | 'supabase'): Promise<void>;
    socialLogin(email: string, id: string, provider: string): Promise<User>;
}
