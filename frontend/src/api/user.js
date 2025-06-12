import { apiPut } from '.';

export const updateUser = (userId, data) => apiPut(`/users/${userId}`, data);