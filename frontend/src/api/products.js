import { apiGet } from ".";

export const getNewArrivals = () => apiGet('/products/new-arrivals');

export const getRecommendations = () => apiGet('/products/recommendations');

export const getProductById = (productId) => apiGet(`/products/${productId}`);

export const getProductsByIds = (productIds) => apiGet('/products/user-products', { ids: productIds });

export const getProducts = (filters) => apiGet('/products/filter-products', filters);

export const searchProducts = (query) => apiGet('/products/search', { query });

export const getFlavors = (packagingId) => apiGet(`/flavors/${packagingId}`);