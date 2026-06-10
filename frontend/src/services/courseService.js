import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getCourses = () => api.get(API.COURSES);
export const getCourseById = (id) => api.get(`${API.COURSES}/${id}`);
export const createCourse = (data) => api.post(API.COURSES, data);
export const updateCourse = (id, data) => api.put(`${API.COURSES}/${id}`, data);
export const deleteCourse = (id) => api.delete(`${API.COURSES}/${id}`);