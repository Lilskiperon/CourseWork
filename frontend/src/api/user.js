import { apiPut } from '.';

export const updateUser = (userId, data) => apiPut(`/users/${userId}`, data);
export const getUserById = (userId) => apiPut(`/users/${userId}`);
export const getAllUsers = () => apiPut('/users');