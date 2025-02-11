import axios from 'axios';
import BASE_URL from '../utils/config';

export const getCartItems = async (items) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/user-products`, {
      params: { ids: items },
    });
    return response.data;
  } catch (err) {
    console.error('Ошибка при получении товаров из корзины:', err);
    throw err;
  }
};
