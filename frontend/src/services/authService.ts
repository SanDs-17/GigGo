import { apiClient } from './api-client';

export const authService = {
  login: async (credentials: any) => {
    const { data } = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    return data;
  },
  
  register: async (userData: any) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },
  
  me: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  }
};
