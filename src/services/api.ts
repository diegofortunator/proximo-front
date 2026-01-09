import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  me: () => api.get('/auth/me'),
};

// Profile API
export const profileApi = {
  getMyProfile: () => api.get('/profiles/me'),
  getProfile: (userId: string) => api.get(`/profiles/${userId}`),
  updateMyProfile: (data: any) => api.put('/profiles/me', data),
  updateProfile: (data: any) => api.put('/profiles/me', data),
  getSettings: () => api.get('/profiles/settings'),
  updateSettings: (data: any) => api.put('/profiles/settings', data),
  toggleVisibility: () => api.patch('/profiles/visibility'),
};

// Location API
export const locationApi = {
  updateLocation: (data: { latitude: number; longitude: number; accuracy?: number; heading?: number }) =>
    api.post('/location/update', data),
  getNearbyUsers: () => api.get('/location/nearby'),
  getMyLocation: () => api.get('/location/me'),
  removeLocation: () => api.delete('/location/me'),
  checkReencounters: () => api.get('/location/reencounters'),
};

// Chat API
export const chatApi = {
  sendMessage: (receiverId: string, content?: string, imageUrl?: string) =>
    api.post('/chat/send', { receiverId, content, imageUrl }),
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (userId: string) => api.get(`/chat/conversation/${userId}`),
  startConversation: (userId: string) => api.post(`/chat/start/${userId}`),
  markAsRead: (messageId: string) => api.patch(`/chat/message/${messageId}/read`),
};

// Groups API
export const groupsApi = {
  getNearbyGroups: () => api.get('/groups/nearby'),
  joinProximityGroup: () => api.post('/groups/join/proximity'),
  joinGroup: (groupId: string) => api.post(`/groups/${groupId}/join`),
  leaveGroup: (groupId: string) => api.post(`/groups/${groupId}/leave`),
  getGroup: (groupId: string) => api.get(`/groups/${groupId}`),
  getMessages: (groupId: string, limit?: number, before?: string) =>
    api.get(`/groups/${groupId}/messages`, { params: { limit, before } }),
  sendMessage: (groupId: string, content?: string, imageUrl?: string) =>
    api.post(`/groups/${groupId}/messages`, { content, imageUrl }),
};

// Blocks API
export const blocksApi = {
  blockUser: (userId: string, reason?: string) =>
    api.post('/blocks', { userId, reason }),
  unblockUser: (userId: string) => api.delete(`/blocks/${userId}`),
  getBlockedUsers: () => api.get('/blocks'),
  checkBlocked: (userId: string) => api.get(`/blocks/check/${userId}`),
};

// Proximity API
export const proximityApi = {
  generateToken: (targetUserId: string) =>
    api.post(`/proximity/token/${targetUserId}`),
  getProfileByToken: (token: string) => api.get(`/proximity/profile/${token}`),
};

// Upload API
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadProfilePhoto: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
