import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getTeaches = () => api.get(API.TEACHES);
export const getTeachById = (id) => api.get(`${API.TEACHES}/${id}`);
export const createTeach = (data) => api.post(API.TEACHES, data);
export const updateTeach = (id, data) => api.put(`${API.TEACHES}/${id}`, data);
export const deleteTeach = (id) => api.delete(`${API.TEACHES}/${id}`);