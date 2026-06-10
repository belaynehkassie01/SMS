// services/attendanceService.js
import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getAttendance = () => api.get(API.ATTENDANCE);
export const getAttendanceById = (id) => api.get(`${API.ATTENDANCE}/${id}`);
export const createAttendance = (data) => api.post(API.ATTENDANCE, data);
export const updateAttendance = (id, data) => api.put(`${API.ATTENDANCE}/${id}`, data);
export const deleteAttendance = (id) => api.delete(`${API.ATTENDANCE}/${id}`);

export const getRecentAttendance = () => {
  return api.get(`${API.ATTENDANCE}/recent`);
};