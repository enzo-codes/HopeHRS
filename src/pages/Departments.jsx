import { useRights } from '../context/UserRightsContext';

export default function Departments() {
  const { hasRight, loadingRights } = useRights();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Departments</h1>
      <p className="mt-2 text-gray-600">Organizational structure management.</p>

      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('DEPT_ADD') && (
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Add Department
            </button>
          )}
          {hasRight('DEPT_EDIT') && (
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Edit Department
            </button>
          )}
          {hasRight('DEPT_DEL') && (
            <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
              Delete Department
            </button>
          )}
          {!hasRight('DEPT_ADD') && !hasRight('DEPT_EDIT') && !hasRight('DEPT_DEL') && (
            <p className="mt-2 text-sm text-gray-500">You do not have action permissions for department management.</p>
          )}
        </div>
      )}
    </div>
  );
}