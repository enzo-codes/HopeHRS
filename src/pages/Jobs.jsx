import { useRights } from '../context/UserRightsContext';

export default function Jobs() {
  const { hasRight, loadingRights } = useRights();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Job Catalogue</h1>
      <p className="mt-2 text-gray-600">Define roles and salary grades.</p>

      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('JOB_ADD') && (
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Add Job
            </button>
          )}
          {hasRight('JOB_EDIT') && (
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Edit Job
            </button>
          )}
          {hasRight('JOB_DEL') && (
            <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
              Delete Job
            </button>
          )}
          {!hasRight('JOB_ADD') && !hasRight('JOB_EDIT') && !hasRight('JOB_DEL') && (
            <p className="mt-2 text-sm text-gray-500">You do not have action permissions for job management.</p>
          )}
        </div>
      )}
    </div>
  );
}