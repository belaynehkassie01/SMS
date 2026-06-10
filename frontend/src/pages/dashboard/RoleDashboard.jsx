// pages/dashboard/RoleDashboard.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';

const RoleDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case ROLES.ADMIN:
      return <Navigate to="/dashboard/admin" replace />;
    case ROLES.TEACHER:
      return <Navigate to="/dashboard/teacher" replace />;
    case ROLES.STUDENT:
      return <Navigate to="/dashboard/student" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleDashboard;