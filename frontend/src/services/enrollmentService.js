import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getEnrollments = () => api.get(API.ENROLLMENTS);
export const getEnrollmentById = (id) => api.get(`${API.ENROLLMENTS}/${id}`);
export const createEnrollment = (data) => api.post(API.ENROLLMENTS, data);
export const updateEnrollment = (id, data) => api.put(`${API.ENROLLMENTS}/${id}`, data);
export const deleteEnrollment = (id) => api.delete(`${API.ENROLLMENTS}/${id}`);