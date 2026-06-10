import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getPersons = () => api.get(API.PERSONS);
export const getPersonById = (id) => api.get(`${API.PERSONS}/${id}`);
export const createPerson = (data) => api.post(API.PERSONS, data);
export const updatePerson = (id, data) => api.put(`${API.PERSONS}/${id}`, data);
export const deletePerson = (id) => api.delete(`${API.PERSONS}/${id}`);