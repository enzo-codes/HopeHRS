import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, error, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        setLocalError(error.message);
      } else {
        navigate('/');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setLocalError(error.message);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${mode === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">Hope HRS</h1>

        {(error || localError) && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Repeat your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
