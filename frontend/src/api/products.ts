// src/api/products.ts

import axiosInstance from './axiosInstance';

export interface Product {
  id: number;
  seller_id: string;
  category_id: number;
  title: string;
  description?: string | null;
  price: number;
  currency?: string;
  stock: number;
  unit?: string;
  images?: string[];
  location_city: string;
  location_coords?: { latitude: number; longitude: number };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// GET
export const getAllProducts = async () => {
  const response = await axiosInstance.get<Product[]>('/products');
  return { success: true, data: response.data };
};

export const getProductById = async (id: string | number) => {
  const response = await axiosInstance.get<Product>(`/products/${id}`);
  return { success: true, data: response.data };
};

export const getProductsBySellerId = async (sellerId: string) => {
  const response = await axiosInstance.get<Product[]>(`/products/seller/${sellerId}`);
  return { success: true, data: response.data };
};

// CREATE & UPDATE → maintenant avec FormData (images incluses)
export const createProduct = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post<Product>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Erreur lors de la création';
    console.error('createProduct error:', error.response?.data || error);
    return { success: false, error: msg };
  }
};

export const updateProduct = async (id: number | string, formData: FormData) => {
  try {
    const response = await axiosInstance.put<Product>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour';
    console.error('updateProduct error:', error.response?.data || error);
    return { success: false, error: msg };
  }
};

// DELETE
export const deleteProduct = async (id: number | string) => {
  try {
    await axiosInstance.delete(`/products/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Erreur lors de la suppression' };
  }
};