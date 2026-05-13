import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { getEmployees } from '../services/employeeService';
import JobHistoryPanel from '../components/JobHistoryPanel';

export default function EmployeeDetail() {
  const { empno } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const { hasRight } = useRights();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        // getEmployees returns all employees the user is allowed to see
        // We filter client-side for the specific empno
        const data = await getEmployees(userType);
        const found = data?.find((e) => String(e.empno) === String(empno));
        if (!found) {
          setError('Employee not found or you do not have access.');
        } else {
          setEmployee(found);
        }
      } catch (err) {
        setError(err.message || 'Failed to load employee.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [empno, userType]);

  const isAdminOrAbove = userType !== 'USER';

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading employee...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/employees')}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Employee List
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back link */}
      <button
        onClick={() => navigate('/employees')}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to Employee List
      </button>

      {/* Employee Profile Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {employee.firstname} {employee.lastname}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Employee No: {employee.empno}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 px-6 py-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Gender</p>
            <p className="mt-1 text-sm text-gray-900">{employee.gender}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Birthdate</p>
            <p className="mt-1 text-sm text-gray-900">{employee.birthdate ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Hire Date</p>
            <p className="mt-1 text-sm text-gray-900">{employee.hiredate}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Separation Date</p>
            <p className="mt-1 text-sm text-gray-900">{employee.sepDate ?? '—'}</p>
          </div>
          {isAdminOrAbove && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Status</p>
              <p className="mt-1 text-sm text-gray-900">{employee.record_status}</p>
            </div>
          )}
          {isAdminOrAbove && (
            <div className="col-span-2 sm:col-span-3">
              <p className="text-xs font-medium uppercase text-gray-400">Stamp</p>
              <p className="mt-1 text-sm text-gray-400 break-all">{employee.stamp ?? '—'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Job History Panel */}
      <div className="mt-8">
        <JobHistoryPanel empNo={empno} />
      </div>
    </div>
  );
}