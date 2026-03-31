import { createContext, useState, useMemo, type ReactNode } from 'react';
import { UserRole } from '../../features/users/domain/UserRole';

interface User {
  id: string;
  email: string;
  role: UserRole;
  accessToken?: string;
  organizationId: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  loginAsDemo: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedUser = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  const [user, setUser] = useState<User | null>(storedUser);
  const isLoading = false;

  const login = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser({ ...userData, accessToken: token });
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: 'demo-user-id',
      email: 'demo@testimo.com',
      role: UserRole.ADMIN,
      accessToken: 'demo-token',
      organizationId: 'demo-org-id'
    };
    login(demoUser, 'demo-token');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
