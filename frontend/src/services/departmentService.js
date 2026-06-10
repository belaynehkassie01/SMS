import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getDepartments = () => api.get(API.DEPARTMENTS);
export const getDepartmentById = (id) => api.get(`${API.DEPARTMENTS}/${id}`);
export const createDepartment = (data) => api.post(API.DEPARTMENTS, data);
export const updateDepartment = (id, data) => api.put(`${API.DEPARTMENTS}/${id}`, data);
export const deleteDepartment = (id) => api.delete(`${API.DEPARTMENTS}/${id}`);