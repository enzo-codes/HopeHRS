//you will consolidate all the placeholders and the protection logic into your main entry point. 
// This configuration ensures that unauthorized users are redirected to the login page while allowing authenticated users to 
// access the HR modules.


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import AuthProvider and rights provider
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';

// 1. Import the Guard Component
import AppShell from './components/AppShell';
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
  return (
    <AuthProvider>
      <UserRightsProvider>
        <BrowserRouter>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* --- PROTECTED HR MODULES --- */}
            <Route element={<AppShell />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/jobhistory" element={<JobHistory />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
              <Route element={<ProtectedRoute requiredRight="DELETED_ITEMS" />}>
                <Route path="/deleted-items" element={<DeletedItems />} />
              </Route>
            </Route>

            {/* --- FALLBACKS --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserRightsProvider>
    </AuthProvider>
  );
}

export default App;