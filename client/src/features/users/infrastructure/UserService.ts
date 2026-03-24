import { UserRole } from '../domain/UserRole';
import { config } from '../../../shared/infrastructure/config';

const API_URL = config.VITE_API_URL;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  provider: string;
}

export class UserService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
        if(response.status === 403) throw new Error('Forbidden: You need admin access.');
        if(response.status === 401) throw new Error('Unauthorized');
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API Error');
    }

    return response.json();
  }

  static async findAll(): Promise<User[]> {
    return this.request<User[]>('users');
  }

  static async createModerator(email: string, password: string): Promise<void> {
    return this.request<void>('auth/moderators', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async updateRole(id: string, role: string): Promise<void> {
    return this.request<void>(`users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }
}