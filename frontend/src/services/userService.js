// services/userService.js
import api from './api';
import { API } from '../constants/apiEndpoints';

export const getUsers = () => api.get(API.USERS);
export const getUserById = (id) => api.get(`${API.USERS}/${id}`);
export const createUser = (data) => api.post(API.USERS, data);
export const updateUser = (id, data) => api.put(`${API.USERS}/${id}`, data);
export const resetPassword = (id, newPassword) => api.put(`${API.USERS}/${id}/reset-password`, { NewPassword: newPassword });
export const deleteUser = (id) => api.delete(`${API.USERS}/${id}`);
export const getPersonsWithoutAccount = () => api.get(`${API.USERS}/persons-without-account`);
export const getRoles = () => api.get(`${API.USERS}/roles`);