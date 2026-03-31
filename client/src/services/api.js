import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getLaws = async (categoryId) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get('/laws', { params });
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const searchLaws = async (query) => {
    const response = await api.get('/laws/search', { params: { q: query } });
    return response.data;
};

export const getLawById = async (id) => {
    const response = await api.get(`/laws/${id}`);
    return response.data;
};

export const createLaw = async (lawData) => {
    const response = await api.post('/laws', lawData);
    return response.data;
};

export const bulkCreateLaws = async (lawsArray) => {
    const response = await api.post('/laws/bulk', { laws: lawsArray });
    return response.data;
};

export const updateLaw = async (id, lawData) => {
    const response = await api.put(`/laws/${id}`, lawData);
    return response.data;
};

export const deleteLaw = async (id) => {
    const response = await api.delete(`/laws/${id}`);
    return response.data;
};

// User API
export const loginUser = async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
};

export const toggleBookmark = async (bookmarkData) => {
    const response = await api.post('/users/bookmarks', bookmarkData);
    return response.data;
};

export const getUserBookmarks = async (userId) => {
    const response = await api.get(`/users/${userId}/bookmarks`);
    return response.data;
};

export default api;
