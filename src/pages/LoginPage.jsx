import { useState } from 'react';
import { supabase } from '../services/supabaseClient'; 
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('/employees'); 
  };

  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-800">HopeHRS Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" required className="w-full rounded-lg border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full rounded-lg border p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">Sign In</button>
        </form>
        <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-2 rounded-lg border py-3 hover:bg-gray-50">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}