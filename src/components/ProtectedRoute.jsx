import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';

const ProtectedRoute = ({ redirectPath = '/login', requiredRight, allowedTypes }) => {
  const { isAuthenticated, loading, userType } = useAuth();
  const { hasRight, loadingRights } = useRights();

  if (loading || loadingRights) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedTypes && !allowedTypes.includes(currentUser?.user_type)) {
    return <Navigate to="/employees" replace />;
  }

  if (requiredRight && !hasRight(requiredRight)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;