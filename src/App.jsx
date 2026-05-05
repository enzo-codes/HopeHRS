//you will consolidate all the placeholders and the protection logic into your main entry point. 
// This configuration ensures that unauthorized users are redirected to the login page while allowing authenticated users to 
// access the HR modules.


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Import the Guard Component
import ProtectedRoute from './components/ProtectedRoute';

// 2. Import all Page Placeholders
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import Admin from './pages/Admin';
import DeletedItems from './pages/DeletedItems';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';

/**
 * App Component
 * Manages the routing hierarchy and session-based access control.
 */
function App() {
  // MOCK SESSION: Set this to 'true' to view the app, or 'false' to test the redirect to /login.
  // In Sprint 2, this will be replaced by your actual Supabase auth state.
  const isAuthenticated = true; 

  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}q
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* --- PROTECTED HR MODULES --- */}
        {/* Everything inside this group requires 'isAuthenticated' to be true */}
        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Note: In Sprint 2, M4 will add extra logic here to block 'USER' from /deleted-items */}
          <Route path="/deleted-items" element={<DeletedItems />} />
        </Route>

        {/* --- FALLBACKS --- */}
        {/* Redirect any unknown URL to the dashboard (if logged in) or login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;