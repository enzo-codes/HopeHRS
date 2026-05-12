import { useEffect, useState } from 'react'; // Added
import { supabase } from '../services/supabaseClient'; // Added
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';

export default function Departments() {
  const { userType } = useAuth();
  const { hasRight, loadingRights } = useRights();
  const [departments, setDepartments] = useState([]); // State for data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from('departments').select('*');
      if (!error) setDepartments(data);
      setLoading(false);
    };
    fetchDepartments();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Departments</h1>
      <p className="mt-2 text-gray-600">Organizational structure management.</p>

      {/* Keep existing permission buttons logic */}
      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('DEPT_ADD') && (
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">Add Department</button>
          )}
          {hasRight('DEPT_EDIT') && (
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Edit Department</button>
          )}
          {hasRight('DEPT_DEL') && (
            <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Delete Department</button>
          )}
          {!hasRight('DEPT_ADD') && !hasRight('DEPT_EDIT') && !hasRight('DEPT_DEL') && (
            <p className="mt-2 text-sm text-gray-500">You do not have action permissions.</p>
          )}
        </div>
      )}

      {/* NEW: Data Table for Sprint 2 */}
      <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Department Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Code</th>
              {userType !== 'USER' && <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Stamp</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="3" className="p-4 text-center text-sm text-slate-500">Loading departments...</td></tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{dept.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dept.department_code}</td>
                  {userType !== 'USER' && <td className="px-6 py-4 text-sm text-slate-400">{dept.created_at}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}