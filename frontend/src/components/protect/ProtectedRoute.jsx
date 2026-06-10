// components/protect/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const { error: notifyError } = useNotification();

  // prevent duplicate notifications
  const hasNotified = useRef(false);

  // show message only once when user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated && !hasNotified.current) {
      notifyError("Please log in to access this page");
      hasNotified.current = true;
    }
  }, [loading, isAuthenticated, notifyError]);

  // loading state (Bootstrap spinner)
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // role-based access check
  const hasAccess =
    allowedRoles.length === 0 || allowedRoles.includes(user?.role);

  // forbidden access
  if (!hasAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  // render protected content
  return children;
};

export default ProtectedRoute;