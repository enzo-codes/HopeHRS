import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { getDepts, softDeleteDept } from '../services/departmentService';
import AddDeptModal from '../components/AddDeptModal';
import EditDeptModal from '../components/EditDeptModal';

export default function Departments() {
  const { user, userType } = useAuth();
  const { hasRight, loadingRights } = useRights();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null); // null = closed, dept object = open

  const isAdminOrAbove = userType !== 'USER';
  const colCount = isAdminOrAbove ? 5 : 2; // deptCode, deptName, record_status*, stamp*, actions*

  const fetchDepts = async () => {
    try {
      setLoading(true);
      const data = await getDepts(userType);
      setDepartments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, [userType]);

  const handleSoftDelete = async (dept) => {
    const confirmed = window.confirm(
      `Deactivate department "${dept.deptName}" (${dept.deptCode})? This will not permanently delete the record.`
    );
    if (!confirmed) return;
    try {
      await softDeleteDept(dept.deptCode, user.id);
      await fetchDepts();
    } catch (err) {
      alert(err.message || 'Failed to deactivate department.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Departments</h1>
      <p className="mt-2 text-gray-600">Organizational structure management.</p>

      {/* Action buttons */}
      {loadingRights ? (
        <p className="mt-4 text-sm text-gray-500">Loading permissions...</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {hasRight('DEPT_ADD') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Department
            </button>
          )}
          {!hasRight('DEPT_ADD') && !hasRight('DEPT_EDIT') && !hasRight('DEPT_DEL') && (
            <p className="mt-2 text-sm text-gray-500">
              You do not have action permissions for department management.
            </p>
          )}
        </div>
      )}

      {/* Add modal */}
      {showAddModal && hasRight('DEPT_ADD') && (
        <AddDeptModal
          onSuccess={() => {
            setShowAddModal(false);
            fetchDepts();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingDept && hasRight('DEPT_EDIT') && (
        <EditDeptModal
          dept={editingDept}
          onSuccess={() => {
            setEditingDept(null);
            fetchDepts();
          }}
          onCancel={() => setEditingDept(null)}
        />
      )}

      {/* Departments table */}
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Dept Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Department Name
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
              {(hasRight('DEPT_EDIT') || hasRight('DEPT_DEL')) && (
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
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.deptCode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.deptCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{dept.deptName}</td>
                  {isAdminOrAbove && (
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          dept.record_status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {dept.record_status}
                      </span>
                    </td>
                  )}
                  {isAdminOrAbove && (
                    <td className="px-6 py-4 text-sm text-gray-400">{dept.stamp}</td>
                  )}
                  {(hasRight('DEPT_EDIT') || hasRight('DEPT_DEL')) && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {hasRight('DEPT_EDIT') && (
                          <button
                            onClick={() => setEditingDept(dept)}
                            className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        )}
                        {hasRight('DEPT_DEL') && dept.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSoftDelete(dept)}
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