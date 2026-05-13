import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addJob } from '../services/jobService';

export default function AddJobModal({ onSuccess, onCancel }) {
  const { user } = useAuth();

  const [form, setForm] = useState({ jobCode: '', jobDesc: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.jobCode.trim() || !form.jobDesc.trim()) {
      setError('Job Code and Job Description are required.');
      return;
    }

    setSubmitting(true);
    try {
      await addJob(
        {
          jobCode: form.jobCode.trim().toUpperCase(),
          jobDesc: form.jobDesc.trim(),
        },
        user.id
      );
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add job.');
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
          <h2 className="text-lg font-semibold text-gray-900">Add Job</h2>
          <button
            onClick={onCancel}
            className="ml-4 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Job Code</label>
              <input
                type="text"
                name="jobCode"
                value={form.jobCode}
                onChange={handleChange}
                placeholder="e.g. MGR01"
                className={inputClass}
                disabled={submitting}
              />
            </div>
            <div>
              <label className={labelClass}>Job Description</label>
              <input
                type="text"
                name="jobDesc"
                value={form.jobDesc}
                onChange={handleChange}
                placeholder="e.g. Department Manager"
                className={inputClass}
                disabled={submitting}
              />
            </div>
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
              className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}