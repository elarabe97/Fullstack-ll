import axios from 'axios';

const API_BASE_URL = 'http://3.238.85.129:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Helper to get token
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('lug_user'));
    return user?.token;
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getProducts = async () => {
    const response = await api.get('/api/products');
    return response.data;
};

export const getProductByCode = async (code) => {
    const response = await api.get(`/api/products/${code}`);
    return response.data;
};

export const getReviews = async (productCode) => {
    const url = productCode ? `/api/reviews?productCode=${productCode}` : '/api/reviews';
    const response = await api.get(url);
    return response.data;
};

export const createReview = async ({ token, ...reviewData }) => {
    const response = await api.post('/api/reviews', reviewData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createOrder = async ({ token, items }) => {
    const response = await api.post('/api/orders', { items }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getMyOrders = async (token) => {
    const response = await api.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Admin functions
export const createProduct = async (product, token) => {
    const response = await api.post('/api/products', product, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateProduct = async (code, product, token) => {
    const response = await api.put(`/api/products/${code}`, product, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteProduct = async (code, token) => {
    await api.delete(`/api/products/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
