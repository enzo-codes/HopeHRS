import { useEffect, useState } from 'react'; // Added these
import { supabase } from '../services/supabaseClient'; // Added this
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';

export default function Employees() {
  const { userType } = useAuth();
  const { hasRight, loadingRights } = useRights();
  const [employees, setEmployees] = useState([]); // State to store data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*');
      if (!error) setEmployees(data);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Employee Management</h1>
      
      {/* Existing Permission Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {hasRight('EMP_ADD') && <button className="rounded-lg bg-green-600 px-4 py-2 text-white">Add Employee</button>}
        {/* ... keep other buttons as they are ... */}
      </div>

      {/* NEW: Data Table for Sprint 2 */}
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              {userType !== 'USER' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stamp</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="3" className="p-4 text-center">Loading data...</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{emp.first_name} {emp.last_name}</td>
                  <td className="px-6 py-4 text-sm">{emp.email}</td>
                  {userType !== 'USER' && <td className="px-6 py-4 text-sm text-gray-400">{emp.created_at}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}