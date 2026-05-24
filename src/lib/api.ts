import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from './store';

const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    // If it's a relative path or missing protocol, fix it
    let fixedUrl = envUrl;
    if (!fixedUrl.startsWith('http')) {
      fixedUrl = `https://${fixedUrl}`;
    }
    // Ensure it ends with /api
    if (!fixedUrl.endsWith('/api')) {
      fixedUrl = fixedUrl.replace(/\/$/, '') + '/api';
    }
    return fixedUrl;
  }

  const IS_PROD = typeof window !== 'undefined' 
    ? !window.location.hostname.includes('localhost')
    : process.env.NODE_ENV === 'production';

  return IS_PROD 
    ? 'https://glabackend-production.up.railway.app/api'
    : 'http://localhost:5005/api';
};

const API_BASE_URL = getApiUrl();

export const createApiClient = (token?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token }),
    },
  });

  return client;
};

export const apiClient = createApiClient();

// Auth APIs
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const { token } = useAuthStore.getState();
    const client = createApiClient(token ?? undefined);
    return client.post('/users/logout');
  },

  getProfile: async (token: string) => {
    const client = createApiClient(token);
    const response = await client.get('/users/profile');
    return response.data;
  },
};

// Audio APIs
export const audioApi = {
  uploadAudio: async (formData: FormData, token: string) => {
    const client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'x-auth-token': token,
      },
    });

    const response = await client.post('/audio/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllAudio: async (filters?: { language?: string; album?: string }) => {
    const response = await apiClient.get('/audio', { params: filters });
    return response.data;
  },

  getAudioById: async (id: string) => {
    const response = await apiClient.get(`/audio/${id}`);
    return response.data;
  },

  deleteAudio: async (id: string, token: string) => {
    const client = createApiClient(token);
    const response = await client.delete(`/audio/${id}`);
    return response.data;
  },
};

// User APIs
export const userApi = {
  getAllUsers: async (token: string) => {
    const client = createApiClient(token);
    const response = await client.get('/users');
    return response.data;
  },

  getUserById: async (id: string, token: string) => {
    const client = createApiClient(token);
    const response = await client.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: any, token: string) => {
    const client = createApiClient(token);
    const response = await client.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string, token: string) => {
    const client = createApiClient(token);
    const response = await client.delete(`/users/${id}`);
    return response.data;
  },
};

// Verse APIs
export const verseApi = {
  getAllVerses: async (token: string) => {
    const client = createApiClient(token);
    const response = await client.get('/verses');
    return response.data;
  },

  createVerse: async (data: any, token: string) => {
    const client = createApiClient(token);
    const response = await client.post('/verses', data);
    return response.data;
  },

  deleteVerse: async (id: string, token: string) => {
    const client = createApiClient(token);
    const response = await client.delete(`/verses/${id}`);
    return response.data;
  },
};
