import axios from '../lib/axios';

export const apiGet = async (url, params = {}) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Ошибка GET-запроса (${url}):`, error);
    throw error;
  }
};

export const apiPut = async (url, data = {}) => {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error(`Ошибка PUT-запроса (${url}):`, error);
    throw error;
  }
};