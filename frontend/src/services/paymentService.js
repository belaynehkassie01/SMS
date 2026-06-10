import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getPayments = () => api.get(API.PAYMENTS);
export const getPaymentById = (id) => api.get(`${API.PAYMENTS}/${id}`);
export const createPayment = (data) => api.post(API.PAYMENTS, data);
export const updatePayment = (id, data) => api.put(`${API.PAYMENTS}/${id}`, data);
export const deletePayment = (id) => api.delete(`${API.PAYMENTS}/${id}`);