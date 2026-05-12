import { useEffect, useState } from 'react'; // Added
import { supabase } from '../services/supabaseClient'; // Added
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';

export default function JobHistory() {
  const { userType } = useAuth();
  const { hasRight, loadingRights } = useRights();
  const [history, setHistory] = useState([]); // State for data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      // Fetching job history with joined data from employees and jobs tables
      const { data, error } = await supabase
        .from('job_history')
        .select(`
          *,
          employees (first_name, last_name),
          jobs (job_title)
        `);
      
      if (!error) setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Job History</h1>
      <p className="mt-2 text-gray-600">Track internal movements and promotions.</p>

      {/* Keep existing permission buttons logic */}
      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('JH_ADD') && (
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">Add Job History</button>
          )}
          {hasRight('JH_EDIT') && (
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Edit Job History</button>
          )}
          {hasRight('JH_DEL') && (
            <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Delete Job History</button>
          )}
        </div>
      )}

      {/* NEW: Data Table for Sprint 2 */}
      <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Start Date</th>
              {userType !== 'USER' && <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Stamp</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center text-sm text-slate-500">Loading history records...</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-sm text-slate-500 italic">No movement records found.</td></tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {record.employees?.first_name} {record.employees?.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.jobs?.job_title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.start_date}</td>
                  {userType !== 'USER' && <td className="px-6 py-4 text-sm text-slate-400">{record.created_at}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}