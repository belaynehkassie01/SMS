import api from "./api";
import { API } from "../constants/apiEndpoints";

// GET ALL STUDENTS
export const getStudents = () => {
  return api.get(API.STUDENTS);
};

// GET STUDENT BY ID
export const getStudentById = (id) => {
  return api.get(`${API.STUDENTS}/${id}`);
};

// CREATE STUDENT
export const createStudent = (data) => {
  return api.post(API.STUDENTS, data);
};

// UPDATE STUDENT
export const updateStudent = (id, data) => {
  return api.put(`${API.STUDENTS}/${id}`, data);
};

// DELETE STUDENT
export const deleteStudent = (id) => {
  return api.delete(`${API.STUDENTS}/${id}`);
};

