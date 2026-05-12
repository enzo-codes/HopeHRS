import { useRights } from '../context/UserRightsContext';

export default function Employees() {
  const { hasRight, loadingRights } = useRights();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Employee Management</h1>
      <p className="mt-2 text-gray-600">Manage staff records and profiles.</p>

      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('EMP_ADD') && (
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Add Employee
            </button>
          )}
          {hasRight('EMP_EDIT') && (
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Edit Employee
            </button>
          )}
          {hasRight('EMP_DEL') && (
            <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
              Delete Employee
            </button>
          )}
          {!hasRight('EMP_ADD') && !hasRight('EMP_EDIT') && !hasRight('EMP_DEL') && (
            <p className="mt-2 text-sm text-gray-500">You do not have action permissions for employee management.</p>
          )}
        </div>
      )}
    </div>
  );
}