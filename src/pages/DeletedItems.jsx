import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDeletedEmployees, recoverEmployee } from '../services/employeeService';
import { getDeletedJobHistory, recoverJobHistory } from '../services/jobHistoryService';
import { getDeletedJobs, recoverJob } from '../services/jobService';
import { getDeletedDepts, recoverDept } from '../services/departmentService';

// ─── Shared helpers ───────────────────────────────────────────────────────────

function LoadingRow({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-4 text-center text-gray-500">
        Loading...
      </td>
    </tr>
  );
}

function EmptyRow({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-4 text-center text-gray-500">
        No records found.
      </td>
    </tr>
  );
}

// ─── Employees Tab ────────────────────────────────────────────────────────────

function EmployeesTab({ userId }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedEmployees = async () => {
    try {
      setLoading(true);
      const data = await getDeletedEmployees();
      setEmployees(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedEmployees();
  }, []);

  const handleRecover = async (emp) => {
    const confirmed = window.confirm(
      `Recover employee ${emp.firstname} ${emp.lastname} (${emp.empno})? This will also restore all their job history rows.`
    );
    if (!confirmed) return;
    try {
      await recoverEmployee(emp.empno, userId);
      await fetchDeletedEmployees();
    } catch (err) {
      alert(err.message || 'Failed to recover employee.');
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Emp No</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Hire Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Sep Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <LoadingRow colSpan={8} />
          ) : employees.length === 0 ? (
            <EmptyRow colSpan={8} />
          ) : (
            employees.map((emp) => (
              <tr key={emp.empno} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.empno}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{emp.lastname}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{emp.firstname}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{emp.gender}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{emp.hiredate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{emp.sepDate ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{emp.stamp}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleRecover(emp)}
                    className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                  >
                    Recover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Job History Tab ──────────────────────────────────────────────────────────

function JobHistoryTab({ userId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedJobHistory = async () => {
    try {
      setLoading(true);
      const data = await getDeletedJobHistory();
      setRows(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedJobHistory();
  }, []);

  const handleRecover = async (row) => {
    const confirmed = window.confirm(
      `Recover job history: ${row.jobCode} effective ${row.effDate} for emp ${row.empNo}?`
    );
    if (!confirmed) return;
    try {
      await recoverJobHistory(row.empNo, row.jobCode, row.effDate, userId);
      await fetchDeletedJobHistory();
    } catch (err) {
      alert(err.message || 'Failed to recover job history.');
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Emp No</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Job</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Effective Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Salary</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <LoadingRow colSpan={7} />
          ) : rows.length === 0 ? (
            <EmptyRow colSpan={7} />
          ) : (
            rows.map((row) => (
              <tr key={`${row.empNo}-${row.jobCode}-${row.effDate}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.empNo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="font-medium">{row.job?.jobDesc ?? row.jobCode}</span>
                  <span className="ml-1 text-xs text-gray-400">({row.jobCode})</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span>{row.department?.deptName ?? row.deptCode}</span>
                  <span className="ml-1 text-xs text-gray-400">({row.deptCode})</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.effDate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₱{Number(row.salary).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{row.stamp}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleRecover(row)}
                    className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                  >
                    Recover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Jobs Tab ─────────────────────────────────────────────────────────────────

function JobsTab({ userId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedJobs = async () => {
    try {
      setLoading(true);
      const data = await getDeletedJobs();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedJobs();
  }, []);

  const handleRecover = async (job) => {
    const confirmed = window.confirm(
      `Recover job "${job.jobDesc}" (${job.jobCode})?`
    );
    if (!confirmed) return;
    try {
      await recoverJob(job.jobCode, userId);
      await fetchDeletedJobs();
    } catch (err) {
      alert(err.message || 'Failed to recover job.');
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Job Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Job Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <LoadingRow colSpan={4} />
          ) : jobs.length === 0 ? (
            <EmptyRow colSpan={4} />
          ) : (
            jobs.map((job) => (
              <tr key={job.jobCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.jobCode}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{job.jobDesc}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{job.stamp}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleRecover(job)}
                    className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                  >
                    Recover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Departments Tab ──────────────────────────────────────────────────────────

function DepartmentsTab({ userId }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedDepts = async () => {
    try {
      setLoading(true);
      const data = await getDeletedDepts();
      setDepartments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedDepts();
  }, []);

  const handleRecover = async (dept) => {
    const confirmed = window.confirm(
      `Recover department "${dept.deptName}" (${dept.deptCode})?`
    );
    if (!confirmed) return;
    try {
      await recoverDept(dept.deptCode, userId);
      await fetchDeletedDepts();
    } catch (err) {
      alert(err.message || 'Failed to recover department.');
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Dept Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Department Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <LoadingRow colSpan={4} />
          ) : departments.length === 0 ? (
            <EmptyRow colSpan={4} />
          ) : (
            departments.map((dept) => (
              <tr key={dept.deptCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.deptCode}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{dept.deptName}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{dept.stamp}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleRecover(dept)}
                    className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                  >
                    Recover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── DeletedItemsPage ─────────────────────────────────────────────────────────

const TABS = ['Employees', 'Job History', 'Jobs', 'Departments'];

export default function DeletedItems() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Employees');

  const renderTab = () => {
    switch (activeTab) {
      case 'Employees':
        return <EmployeesTab userId={user?.id} />;
      case 'Job History':
        return <JobHistoryTab userId={user?.id} />;
      case 'Jobs':
        return <JobsTab userId={user?.id} />;
      case 'Departments':
        return <DepartmentsTab userId={user?.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Deleted Items</h1>
      <p className="mt-2 text-gray-600">
        View and recover soft-deleted records. Only INACTIVE records are shown here.
      </p>

      {/* Tab bar */}
      <div className="mt-6 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">{renderTab()}</div>
    </div>
  );
}