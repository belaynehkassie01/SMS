import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getAcademicYears = () => api.get(API.ACADEMIC_YEARS);
export const getAcademicYearById = (id) => api.get(`${API.ACADEMIC_YEARS}/${id}`);
export const createAcademicYear = (data) => api.post(API.ACADEMIC_YEARS, data);
export const updateAcademicYear = (id, data) => api.put(`${API.ACADEMIC_YEARS}/${id}`, data);
export const deleteAcademicYear = (id) => api.delete(`${API.ACADEMIC_YEARS}/${id}`);