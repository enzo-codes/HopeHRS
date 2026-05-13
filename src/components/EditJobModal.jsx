import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateJob } from '../services/jobService';

export default function EditJobModal({ job, onSuccess, onCancel }) {
  const { user } = useAuth();

  // jobCode is the PK — only jobDesc is editable
  const [jobDesc, setJobDesc] = useState(job.jobDesc ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!jobDesc.trim()) {
      setError('Job Description is required.');
      return;
    }

    setSubmitting(true);
    try {
      await updateJob(job.jobCode, { jobDesc: jobDesc.trim() }, user.id);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update job.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
  const labelClass = 'block text-xs font-medium uppercase text-gray-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Job</h2>
            <p className="mt-0.5 text-sm text-gray-500">Job Code: {job.jobCode}</p>
          </div>
          <button
            onClick={onCancel}
            className="ml-4 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Read-only PK notice */}
        <div className="mb-4 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
          <span className="font-medium">Job Code:</span> {job.jobCode}
          <p className="mt-1 italic">Job Code is the primary key and cannot be changed.</p>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label className={labelClass}>Job Description</label>
            <input
              type="text"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className={inputClass}
              disabled={submitting}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}