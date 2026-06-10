import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getTeachers = () => api.get(API.TEACHERS);

export const getTeacherById = (id) =>
  api.get(`${API.TEACHERS}/${id}`);

export const createTeacher = (data) =>
  api.post(API.TEACHERS, data);

export const updateTeacher = (id, data) =>
  api.put(`${API.TEACHERS}/${id}`, data);

export const deleteTeacher = (id) =>
  api.delete(`${API.TEACHERS}/${id}`);
export const getTeacherSections = () => {
  return api.get(`${API.TEACHERS}/my-sections`);
};