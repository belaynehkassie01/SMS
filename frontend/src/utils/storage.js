// utils/storage.js
const TOKEN_KEY = 'sms_token';
const USER_KEY = 'sms_user';

export const storage = {
  // Token
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  
  // User
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  removeUser: () => localStorage.removeItem(USER_KEY),
  
  // Clear all
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  // Check if logged in
  isLoggedIn: () => !!storage.getToken() && !!storage.getUser(),
};