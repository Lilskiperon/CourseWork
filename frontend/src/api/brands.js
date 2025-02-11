import axios from 'axios';
import BASE_URL from '../utils/config';


export const getBrands = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/products/brands`);
    return data;
  } catch (error) {
    console.error('Ошибка при получении брендов:', error);
    throw error;
  }
};
