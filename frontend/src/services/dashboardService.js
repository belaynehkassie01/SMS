import api from "./api";
import { API } from "../constants/apiEndpoints";

export const getDashboardStats = async () => {
  const response = await api.get(`${API.DASHBOARD}/stats`);
  return response.data.data;
};