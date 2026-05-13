import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addJobHistory } from '../services/jobHistoryService';

export default function AddJobHistoryForm({ empNo, onSuccess, onCancel }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    jobCode: '',
    effDate: '',
    salary: '',
    deptCode: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.jobCode || !form.effDate || !form.salary || !form.deptCode) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      await addJobHistory(
        {
          empNo,
          jobCode: form.jobCode.trim().toUpperCase(),
          effDate: form.effDate,
          salary: parseFloat(form.salary),
          deptCode: form.deptCode.trim().toUpperCase(),
        },
        user.id
      );
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add job history.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
  const labelClass = 'block text-xs font-medium uppercase text-gray-500';

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-gray-800">New Job History Entry</h3>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
            <label className={labelClass}>Dept Code</label>
            <input
              type="text"
              name="deptCode"
              value={form.deptCode}
              onChange={handleChange}
              placeholder="e.g. D001"
              className={inputClass}
              disabled={submitting}
            />
          </div>
          <div>
            <label className={labelClass}>Effective Date</label>
            <input
              type="date"
              name="effDate"
              value={form.effDate}
              onChange={handleChange}
              className={inputClass}
              disabled={submitting}
            />
          </div>
          <div>
            <label className={labelClass}>Salary</label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 35000"
              min="0"
              step="0.01"
              className={inputClass}
              disabled={submitting}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Entry'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}