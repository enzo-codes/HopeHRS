import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          username: form.username
        }
      }
    });
    if (error) alert(error.message);
    else alert('Registration successful! Please check your email.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold">Create Account</h2>
        <form onSubmit={handleRegister} className="grid gap-4">
          <div className="flex gap-2">
            <input type="text" placeholder="First Name" required className="w-1/2 border p-3 rounded-lg" onChange={(e) => setForm({...form, firstName: e.target.value})} />
            <input type="text" placeholder="Last Name" required className="w-1/2 border p-3 rounded-lg" onChange={(e) => setForm({...form, lastName: e.target.value})} />
          </div>
          <input type="text" placeholder="Username" required className="border p-3 rounded-lg" onChange={(e) => setForm({...form, username: e.target.value})} />
          <input type="email" placeholder="Email" required className="border p-3 rounded-lg" onChange={(e) => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="border p-3 rounded-lg" onChange={(e) => setForm({...form, password: e.target.value})} />
          <button className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">Register</button>
        </form>
      </div>
    </div>
  );
}