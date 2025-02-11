import axios from 'axios';
import BASE_URL from '../utils/config';

export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, formData);
        return response.data; 
    } catch (error) {
        const message = error.response?.data?.error || "Ошибка регистрации";
        console.error("Ошибка при регистрации:", message);
        throw new Error(message);
    }
};

// Вход пользователя
export const loginUser = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
            withCredentials: true
        });
        return response.data; 
    } catch (error) {
        const message = error.response?.data?.error || "Ошибка входа";
        console.error("Ошибка при входе:", message);
        throw new Error(message);
    }
};
export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/auth/me`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Ошибка получения информации о пользователе";
        console.error("Ошибка при получении информации о пользователе:", message);
        throw new Error(message);
    }
};

export const logoutUser = async () => {
    const response = await axios.post(`${BASE_URL}/auth/logout`);
    return response.data;
};