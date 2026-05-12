import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Archive() {
  const { userType } = useAuth();
  const [archivedEmployees, setArchivedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchive = async () => {
      // We fetch employees where the deleted_at column is NOT null
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .not('deleted_at', 'is', null);

      if (!error) setArchivedEmployees(data);
      setLoading(false);
    };
    fetchArchive();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Archived Records</h1>
      <p className="mt-2 text-gray-600">Viewing soft-deleted employee profiles and history.</p>

      <div className="mt-8 overflow-hidden rounded-lg border border-red-100 bg-white shadow-sm">
        <div className="bg-red-50 px-6 py-3 border-b border-red-100">
          <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wider">Deleted Employee Directory</h2>
        </div>
        
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Original Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Deletion Date</th>
              {userType !== 'USER' && <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Stamp</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-slate-400">Scanning archives...</td></tr>
            ) : archivedEmployees.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-center text-slate-400 italic">No archived records found.</td></tr>
            ) : (
              archivedEmployees.map((emp) => (
                <tr key={emp.id} className="bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{emp.first_name} {emp.last_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.department_id || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-mono">{new Date(emp.deleted_at).toLocaleDateString()}</td>
                  {userType !== 'USER' && <td className="px-6 py-4 text-sm text-slate-400">{emp.created_at}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}