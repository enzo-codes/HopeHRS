import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const sidebarLinks = [
  { name: 'Employees', path: '/employees' },
  { name: 'Job History', path: '/job-history' },
  { name: 'Jobs', path: '/jobs' },
  { name: 'Departments', path: '/departments' },
  { name: 'Admin', path: '/admin' },
  { name: 'Deleted Items', path: '/deleted-items' },
];

export default function AppShell() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen w-full">
      <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300`}>
        <div className="p-6 font-bold text-xl border-b border-slate-800">HopeHRS</div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          {sidebarLinks.map(link => (
            <Link key={link.path} to={link.path} className="p-3 hover:bg-slate-800 rounded-lg">
              {isOpen ? link.name : link.name[0]}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col bg-slate-50">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <button onClick={() => setIsOpen(!isOpen)}>☰</button>
          <button onClick={() => supabase.auth.signOut()} className="text-red-500 text-sm font-medium">Logout</button>
        </header>
        <div className="p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
