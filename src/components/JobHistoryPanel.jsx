import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import {
  getJobHistory,
  softDeleteJobHistory,
} from '../services/jobHistoryService';
import AddJobHistoryForm from './AddJobHistoryForm';
import EditJobHistoryModal from './EditJobHistoryModal';

export default function JobHistoryPanel({ empNo }) {
  const { user, userType } = useAuth();
  const { hasRight } = useRights();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // null = closed, row object = open

  const isAdminOrAbove = userType !== 'USER';

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getJobHistory(empNo, userType);
      setRows(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load job history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [empNo, userType]);

  const handleSoftDelete = async (row) => {
    const confirmed = window.confirm(
      `Deactivate job history entry: ${row.jobCode} effective ${row.effDate}?`
    );
    if (!confirmed) return;
    try {
      await softDeleteJobHistory(row.empNo, row.jobCode, row.effDate, user.id);
      await fetchHistory(); // refresh after delete
    } catch (err) {
      alert(err.message || 'Failed to deactivate job history row.');
    }
  };

  // Column count for colSpan calculation
  // jobDesc, deptName, effDate, salary, record_status (admin+), stamp (admin+), actions column
  const colCount = isAdminOrAbove ? 7 : 5;

  return (
    <div>
      {/* Panel header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Job History</h2>
        {hasRight('JH_ADD') && (
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            {showAddForm ? 'Cancel' : '+ Add Job History'}
          </button>
        )}
      </div>

      {/* Add form — shown inline when toggled */}
      {showAddForm && hasRight('JH_ADD') && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <AddJobHistoryForm
            empNo={empNo}
            onSuccess={() => {
              setShowAddForm(false);
              fetchHistory();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Edit modal */}
      {editingRow && hasRight('JH_EDIT') && (
        <EditJobHistoryModal
          row={editingRow}
          onSuccess={() => {
            setEditingRow(null);
            fetchHistory();
          }}
          onCancel={() => setEditingRow(null)}
        />
      )}

      {/* Job history table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Effective Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Salary
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
              {/* Actions column — only shown if user has at least one action right */}
              {(hasRight('JH_EDIT') || hasRight('JH_DEL')) && (
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
            ) : error ? (
              <tr>
                <td colSpan={colCount} className="p-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="p-4 text-center text-gray-500">
                  No job history records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={`${row.empNo}-${row.jobCode}-${row.effDate}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium text-gray-900">
                      {row.job?.jobDesc ?? row.jobCode}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">({row.jobCode})</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-gray-900">
                      {row.department?.deptName ?? row.deptCode}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">({row.deptCode})</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.effDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₱{Number(row.salary).toLocaleString()}
                  </td>
                  {isAdminOrAbove && (
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.record_status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {row.record_status}
                      </span>
                    </td>
                  )}
                  {isAdminOrAbove && (
                    <td className="px-6 py-4 text-sm text-gray-400">{row.stamp}</td>
                  )}
                  {(hasRight('JH_EDIT') || hasRight('JH_DEL')) && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {hasRight('JH_EDIT') && (
                          <button
                            onClick={() => setEditingRow(row)}
                            className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        )}
                        {hasRight('JH_DEL') && row.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSoftDelete(row)}
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