import { apiGet } from ".";

export const getOrderHistory = (userId) => apiGet(`/orders/user/${userId}`);