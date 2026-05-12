import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';

import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import Admin from './pages/Admin';
import DeletedItems from './pages/DeletedItems';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';

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

              {/* ADMIN and SUPERADMIN only — USER gets redirected to /employees */}
              <Route element={<ProtectedRoute allowedTypes={['ADMIN', 'SUPERADMIN']} />}>
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