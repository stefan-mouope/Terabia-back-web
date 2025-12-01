import axiosInstance from './axiosInstance';
import { UserRole } from '@/contexts/AuthContext'; // Assuming UserRole is defined here

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  city: string;
  gender?: string;
  cni?: string;
  avatar_url?: string;
  is_active?: boolean;
  is_verified?: boolean;
  rating?: number;
  total_ratings?: number;
  email?: string; // Add email as it's part of the User in AuthContext now
}

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export const getUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch user' };
  }
};

export const getSellerStats = async (sellerId: string) => {
  try {
    const response = await axiosInstance.get<SellerStats>(`/users/stats/${sellerId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch seller stats' };
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'is_active' | 'is_verified' | 'rating' | 'total_ratings'>) => {
  try {
    const response = await axiosInstance.post<User>('/users', userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to create user' };
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put<User>(`/users/${id}`, userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to update user' };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete user' };
  }
};
