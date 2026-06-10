import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getResults = () => api.get(API.RESULTS);
export const getResultById = (id) => api.get(`${API.RESULTS}/${id}`);
export const createResult = (data) => api.post(API.RESULTS, data);
export const updateResult = (id, data) => api.put(`${API.RESULTS}/${id}`, data);
export const deleteResult = (id) => api.delete(`${API.RESULTS}/${id}`);