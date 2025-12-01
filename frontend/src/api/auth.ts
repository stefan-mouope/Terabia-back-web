import axiosInstance from './axiosInstance';
import { UserRole } from '@/contexts/AuthContext';

interface AuthResponse {
  user: { id: string; role: UserRole; email: string; name?: string; phone?: string; city?: string };
  token: string;
}

export const register = async (userData: any) => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Registration failed' };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Login failed' };
  }
};
