import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { getEmployees } from '../services/employeeService';

export default function Employees() {
  const { userType } = useAuth();
  const { hasRight, loadingRights } = useRights();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees(userType); // uses service, handles ACTIVE filter
        setEmployees(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [userType]); // re-fetch if userType changes

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Employee Management</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        {hasRight('EMP_ADD') && (
          <button className="rounded-lg bg-green-600 px-4 py-2 text-white">Add Employee</button>
        )}
        {hasRight('EMP_EDIT') && (
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">Edit Employee</button>
        )}
        {hasRight('EMP_DEL') && (
          <button className="rounded-lg bg-red-600 px-4 py-2 text-white">Delete Employee</button>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Emp No</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Hire Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Sep Date</th>
              {userType !== 'USER' && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stamp</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={userType !== 'USER' ? 7 : 6} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={userType !== 'USER' ? 7 : 6} className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.empno} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{emp.empno}</td>
                  <td className="px-6 py-4 text-sm">{emp.lastname}</td>
                  <td className="px-6 py-4 text-sm">{emp.firstname}</td>
                  <td className="px-6 py-4 text-sm">{emp.gender}</td>
                  <td className="px-6 py-4 text-sm">{emp.hiredate}</td>
                  <td className="px-6 py-4 text-sm">{emp.sepDate ?? '—'}</td>
                  {userType !== 'USER' && (
                    <td className="px-6 py-4 text-sm text-gray-400">{emp.stamp}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
