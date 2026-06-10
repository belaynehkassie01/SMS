import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getSections = () => api.get(API.SECTIONS);
export const getSectionById = (id) => api.get(`${API.SECTIONS}/${id}`);
export const createSection = (data) => api.post(API.SECTIONS, data);
export const updateSection = (id, data) => api.put(`${API.SECTIONS}/${id}`, data);
export const deleteSection = (id) => api.delete(`${API.SECTIONS}/${id}`);