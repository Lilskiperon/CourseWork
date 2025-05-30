import { apiGet } from ".";

export const getNewArrivals = () => apiGet('/packagings/');

export const getRecommendations = () => apiGet('/packagings/');

export const getProductById = (productId) => apiGet(`/products/${productId}`);

export const getProductsByIds = (productIds) => apiGet('/packagings/user-products', { ids: productIds });

export const getProducts = (filters) => apiGet('/packagings/filter-products', filters);

export const searchProducts = (query) => apiGet('/packagings/search', { query });

export const getFlavors = (packagingId) => apiGet(`/flavors/product/${packagingId}`);