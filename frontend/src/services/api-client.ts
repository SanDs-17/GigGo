import axios from 'axios';

// Utility to convert snake_case to camelCase
const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const isObject = (o: any) => o === Object(o) && !Array.isArray(o) && typeof o !== 'function';

const deepCamel = (data: any): any => {
  if (isObject(data)) {
    const n = {};
    Object.keys(data).forEach((k) => {
      (n as any)[toCamelCase(k)] = deepCamel(data[k]);
    });
    return n;
  } else if (Array.isArray(data)) {
    return data.map((i) => deepCamel(i));
  }
  return data;
};

// Create Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: deepCamel conversion & error handling
apiClient.interceptors.response.use(
  (response) => {
    response.data = deepCamel(response.data);
    return response;
  },
  (error) => {
    // Optionally add token refresh logic here
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // window.location.href = '/auth'; // Only if strict redirect needed
      }
    }
    return Promise.reject(error);
  }
);
