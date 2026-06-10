// context/NotificationContext.jsx
import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useRef
} from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // store timeouts to avoid memory leaks
  const timeoutsRef = useRef({});

  const generateId = () =>
    Date.now() + Math.random().toString(36).substring(2, 8);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // clear timeout if exists
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  // Add notification
  const addNotification = useCallback((message, type = "info", duration = 5000) => {
    const id = generateId();

    const newNotification = { id, message, type, duration };

    setNotifications((prev) => [...prev, newNotification]);

    if (duration > 0) {
      timeoutsRef.current[id] = setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);

    // clear all timeouts
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};
  }, []);

  // helpers
  const success = useCallback((msg, duration) =>
    addNotification(msg, "success", duration),
  [addNotification]);

  const error = useCallback((msg, duration) =>
    addNotification(msg, "error", duration),
  [addNotification]);

  const warning = useCallback((msg, duration) =>
    addNotification(msg, "warning", duration),
  [addNotification]);

  const info = useCallback((msg, duration) =>
    addNotification(msg, "info", duration),
  [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider"
    );
  }

  return context;
};