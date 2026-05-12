import { useRights } from '../context/UserRightsContext';

export default function JobHistory() {
  const { hasRight, loadingRights } = useRights();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Job History</h1>
      <p className="mt-2 text-gray-600">Track internal movements and promotions.</p>

      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('JH_ADD') && (
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Add Job History
            </button>
          )}
          {hasRight('JH_EDIT') && (
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Edit Job History
            </button>
          )}
          {hasRight('JH_DEL') && (
            <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
              Delete Job History
            </button>
          )}
          {!hasRight('JH_ADD') && !hasRight('JH_EDIT') && !hasRight('JH_DEL') && (
            <p className="mt-2 text-sm text-gray-500">You do not have action permissions for job history management.</p>
          )}
        </div>
      )}
    </div>
  );
}