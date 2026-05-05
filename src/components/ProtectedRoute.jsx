//This component acts as a wrapper. It checks if a user is authenticated; if not, it redirects them to the login page. 
// Since M4 (Rights & Auth) DEVELOPER is still working on the actual Supabase session logic, you can use a temporary boolean for now.
//M4 You can change this based on the requirements for the deliverables


import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, redirectPath = '/login' }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;