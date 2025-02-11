import axios from 'axios';
import BASE_URL from '../utils/config';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
});

export const apiGet = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Ошибка GET-запроса (${url}):`, error);
    throw error;
  }
};