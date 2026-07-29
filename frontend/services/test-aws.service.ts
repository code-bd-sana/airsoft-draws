import { api } from './api';

export const testAwsService = {
  async createTestAw(formData: FormData): Promise<any> {
    const response = await api.post('/test-aws', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getTestAws(): Promise<any> {
    const response = await api.get('/test-aws');
    return response.data;
  },
};
