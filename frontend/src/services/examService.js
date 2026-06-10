import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getExams = () => api.get(API.EXAMS);
export const getExamById = (id) => api.get(`${API.EXAMS}/${id}`);
export const createExam = (data) => api.post(API.EXAMS, data);
export const updateExam = (id, data) => api.put(`${API.EXAMS}/${id}`, data);
export const deleteExam = (id) => api.delete(`${API.EXAMS}/${id}`);

export const getUpcomingExams = () => {
  return api.get(`${API.EXAMS}/upcoming`);
};