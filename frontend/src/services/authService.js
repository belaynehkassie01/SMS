import api from "./api";
import { API } from "../constants/apiEndpoints";
import { storage } from "../utils/storage";

export const login = async (username, password) => {
  const res = await api.post(API.AUTH.LOGIN, { username, password });
  const { token, user } = res.data;

  storage.setToken(token);
  storage.setUser(user);

  return { token, user };
};

export const logout = () => {
  storage.clearAll();
};

export const getMe = () => api.get(API.AUTH.ME);