import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateJobHistory } from '../services/jobHistoryService';

export default function EditJobHistoryModal({ row, onSuccess, onCancel }) {
  const { user } = useAuth();

  // Only salary and deptCode are editable — empNo, jobCode, effDate are the composite PK
  const [form, setForm] = useState({
    salary: row.salary ?? '',
    deptCode: row.deptCode ?? '',
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

    if (!form.salary || !form.deptCode) {
      setError('Salary and Department Code are required.');
      return;
    }

    setSubmitting(true);
    try {
      await updateJobHistory(
        row.empNo,
        row.jobCode,
        row.effDate,
        {
          salary: parseFloat(form.salary),
          deptCode: form.deptCode.trim().toUpperCase(),
        },
        user.id
      );
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update job history.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
  const labelClass = 'block text-xs font-medium uppercase text-gray-500';

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Modal header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Job History</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {row.job?.jobDesc ?? row.jobCode} — effective {row.effDate}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="ml-4 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Read-only PK info */}
        <div className="mb-4 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
          <span className="font-medium">Employee No:</span> {row.empNo} &nbsp;·&nbsp;
          <span className="font-medium">Job Code:</span> {row.jobCode} &nbsp;·&nbsp;
          <span className="font-medium">Eff. Date:</span> {row.effDate}
          <p className="mt-1 italic">These fields are part of the primary key and cannot be changed.</p>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department Code</label>
              <input
                type="text"
                name="deptCode"
                value={form.deptCode}
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
                min="0"
                step="0.01"
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