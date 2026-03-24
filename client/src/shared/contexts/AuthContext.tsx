import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { UserRole } from '../../features/users/domain/UserRole'; // Assuming create this later or define inline

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser({ ...userData, accessToken: token });
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: 'demo-user-id',
      email: 'demo@cubepath.com',
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
