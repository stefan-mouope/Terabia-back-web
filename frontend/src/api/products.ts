import axiosInstance from './axiosInstance';

export interface Product {
  id: string;
  seller_id: string;
  category_id: number;
  title: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  unit: string;
  images?: string[];
  location_city: string;
  location_coords?: { latitude: number; longitude: number };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get<Product[]>('/products');
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch products' };
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch product' };
  }
};

export const getProductsBySellerId = async (sellerId: string) => {
  try {
    const response = await axiosInstance.get<Product[]>(`/products/seller/${sellerId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch seller products' };
  }
};

export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const response = await axiosInstance.post<Product>('/products', productData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to create product' };
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  try {
    const response = await axiosInstance.put<Product>(`/products/${id}`, productData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to update product' };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete product' };
  }
};
