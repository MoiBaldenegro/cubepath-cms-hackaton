import { config } from '../../../shared/infrastructure/config';
import type { AuthRepository, User } from '../domain/AuthRepository';

export class FetchAuthRepository implements AuthRepository {
    private readonly baseUrl = `${config.VITE_API_URL}/auth`;

    async login(email: string, password: string, provider: 'local' | 'supabase' = 'local'): Promise<User> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, provider }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    }

    async register(email: string, password: string, provider: 'local' | 'supabase' = 'local'): Promise<void> {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, provider }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }
    }

    async socialLogin(email: string, id: string, provider: string): Promise<User> {
        const response = await fetch(`${this.baseUrl}/social-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, id, provider }),
        });

        if (!response.ok) {
            throw new Error('Social login failed');
        }

        return response.json();
    }
}
