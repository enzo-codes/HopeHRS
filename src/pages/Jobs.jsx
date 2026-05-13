import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { getJobs, softDeleteJob } from '../services/jobService';
import AddJobModal from '../components/AddJobModal';
import EditJobModal from '../components/EditJobModal';

export default function Jobs() {
  const { user, userType } = useAuth();
  const { hasRight, loadingRights } = useRights();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null = closed, job object = open

  const isAdminOrAbove = userType !== 'USER';
  const colCount = isAdminOrAbove ? 5 : 2; // jobCode, jobDesc, record_status*, stamp*, actions*

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs(userType);
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [userType]);

  const handleSoftDelete = async (job) => {
    const confirmed = window.confirm(
      `Deactivate job "${job.jobDesc}" (${job.jobCode})? This will not permanently delete the record.`
    );
    if (!confirmed) return;
    try {
      await softDeleteJob(job.jobCode, user.id);
      await fetchJobs();
    } catch (err) {
      alert(err.message || 'Failed to deactivate job.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Job Catalogue</h1>
      <p className="mt-2 text-gray-600">Define roles and salary grades.</p>

      {/* Action buttons */}
      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('JOB_ADD') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Job
            </button>
          )}
          {!hasRight('JOB_ADD') && !hasRight('JOB_EDIT') && !hasRight('JOB_DEL') && (
            <p className="mt-2 text-sm text-gray-500">
              You do not have action permissions for job management.
            </p>
          )}
        </div>
      )}

      {/* Add modal */}
      {showAddModal && hasRight('JOB_ADD') && (
        <AddJobModal
          onSuccess={() => {
            setShowAddModal(false);
            fetchJobs();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingJob && hasRight('JOB_EDIT') && (
        <EditJobModal
          job={editingJob}
          onSuccess={() => {
            setEditingJob(null);
            fetchJobs();
          }}
          onCancel={() => setEditingJob(null)}
        />
      )}

      {/* Jobs table */}
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Job Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Job Description
              </th>
              {isAdminOrAbove && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
              )}
              {isAdminOrAbove && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Stamp
                </th>
              )}
              {(hasRight('JOB_EDIT') || hasRight('JOB_DEL')) && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={colCount} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.jobCode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.jobCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.jobDesc}</td>
                  {isAdminOrAbove && (
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          job.record_status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {job.record_status}
                      </span>
                    </td>
                  )}
                  {isAdminOrAbove && (
                    <td className="px-6 py-4 text-sm text-gray-400">{job.stamp}</td>
                  )}
                  {(hasRight('JOB_EDIT') || hasRight('JOB_DEL')) && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {hasRight('JOB_EDIT') && (
                          <button
                            onClick={() => setEditingJob(job)}
                            className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        )}
                        {hasRight('JOB_DEL') && job.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSoftDelete(job)}
                            className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
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