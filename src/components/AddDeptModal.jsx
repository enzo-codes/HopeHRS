import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addDept } from '../services/departmentService';

export default function AddDeptModal({ onSuccess, onCancel }) {
  const { user } = useAuth();

  const [form, setForm] = useState({ deptCode: '', deptName: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.deptCode.trim() || !form.deptName.trim()) {
      setError('Department Code and Department Name are required.');
      return;
    }

    setSubmitting(true);
    try {
      await addDept(
        {
          deptCode: form.deptCode.trim().toUpperCase(),
          deptName: form.deptName.trim(),
        },
        user.id
      );
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add department.');
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
          <h2 className="text-lg font-semibold text-gray-900">Add Department</h2>
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
              <label className={labelClass}>Department Code</label>
              <input
                type="text"
                name="deptCode"
                value={form.deptCode}
                onChange={handleChange}
                placeholder="e.g. D009"
                className={inputClass}
                disabled={submitting}
              />
            </div>
            <div>
              <label className={labelClass}>Department Name</label>
              <input
                type="text"
                name="deptName"
                value={form.deptName}
                onChange={handleChange}
                placeholder="e.g. Information Technology"
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
              {submitting ? 'Saving...' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}