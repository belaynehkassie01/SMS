import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getRoles = () => api.get(API.ROLES);
export const getRoleById = (id) => api.get(`${API.ROLES}/${id}`);
export const createRole = (data) => api.post(API.ROLES, data);
export const updateRole = (id, data) => api.put(`${API.ROLES}/${id}`, data);
export const deleteRole = (id) => api.delete(`${API.ROLES}/${id}`);