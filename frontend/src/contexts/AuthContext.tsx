import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '@/api/auth'; // Import API functions

export type UserRole = 'buyer' | 'seller' | 'delivery';

export interface User {
  id: string;
  email: string; // Email will now be part of the User object, not just AuthUser
  role: UserRole;
  name: string; // Replaces firstName and lastName
  phone: string;
  city: string;
  cni?: string;
  avatar_url?: string;
  is_active?: boolean;
  is_verified?: boolean;
  rating?: number;
  total_ratings?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('terabia_jwt_token');
    const storedUser = localStorage.getItem('terabia_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        // In a real app, you would verify the token with the backend here
        // and potentially refresh it if it's expired.
      } catch (error) {
        console.error('Failed to parse stored user or token:', error);
        localStorage.removeItem('terabia_jwt_token');
        localStorage.removeItem('terabia_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await apiLogin(email, password);
      if (result.success && result.data) {
        localStorage.setItem('terabia_jwt_token', result.data.token);
        localStorage.setItem('terabia_user', JSON.stringify(result.data.user));
        setUser(result.data.user);
        redirectToRoleDashboard(result.data.user.role);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (userData: any) => { // userData will now directly match backend's expected structure
    try {
      const result = await apiRegister(userData);
      if (result.success && result.data) {
        localStorage.setItem('terabia_jwt_token', result.data.token);
        localStorage.setItem('terabia_user', JSON.stringify(result.data.user));
        setUser(result.data.user);
        redirectToRoleDashboard(result.data.user.role);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('terabia_jwt_token');
    localStorage.removeItem('terabia_user');
    navigate('/login');
  };

  const redirectToRoleDashboard = (role: UserRole) => {
    const roleRoutes: Record<UserRole, string> = {
      buyer: '/',
      seller: '/vendor-dashboard',
      delivery: '/delivery-dashboard',
    };
    navigate(roleRoutes[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
