import axiosInstance from './axiosInstance';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  created_at?: string;
}

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get<Category[]>('/categories');
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch categories' };
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch category' };
  }
};

export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
  try {
    const response = await axiosInstance.post<Category>('/categories', categoryData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to create category' };
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>) => {
  try {
    const response = await axiosInstance.put<Category>(`/categories/${id}`, categoryData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to update category' };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete category' };
  }
};
