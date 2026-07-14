import { api } from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  isActive: boolean;
}

export const categoryService = {
  async getPublicCategories(): Promise<Category[]> {
    const response = await api.get('/categories/public');
    return response.data;
  },

  async getAllCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/categories/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
