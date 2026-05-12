import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Admin() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      // Fetching logs from the table M3/M4 created
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Module</h1>
      <p className="mt-2 text-red-600 font-semibold italic">Authorized Personnel Only</p>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-red-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent System Activity</h2>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium text-gray-700">{log.action}</p>
                <p className="text-xs text-gray-500">{log.performed_by}</p>
              </div>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}