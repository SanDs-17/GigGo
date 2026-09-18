import { apiClient } from './api-client';

export interface Provider {
  id: number;
  slug: string;
  name: string;
  category: string;
  city: string;
  tagline?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  coverImage?: string;
  packages?: any[]; // added packages
}

export const providerService = {
  getFeatured: async () => {
    const { data } = await apiClient.get<Provider[]>('/providers/featured');
    return data;
  },
  
  getList: async (params?: { category?: string; city?: string; min_rating?: number }) => {
    const { data } = await apiClient.get<Provider[]>('/providers', { params });
    return data;
  },
  
  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<Provider>(`/providers/${slug}`);
    return data;
  }
};
