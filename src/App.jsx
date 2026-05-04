import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';

function App() {
  const [status, setStatus] = useState('Connecting to Hope HRS database...');
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Querying the employee table from the HopeDB setup
        const { data, error } = await supabase
          .from('employee')
          .select('*')
          .limit(1);

        if (error) {
          setStatus(`Connection failed: ${error.message}`);
          console.error('Supabase Error:', error);
        } else {
          setStatus('Connected successfully to Hope HRS database!');
          setEmployeeData(data);
          console.log('Data retrieved:', data);
        }
      } catch (err) {
        setStatus('An unexpected error occurred. Check console for details.');
        console.error('Error:', err);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-xl text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Hope HRS System</h1>
        
        <div className="inline-flex items-center space-x-2 bg-zinc-800/50 px-3 py-1 rounded-full text-sm text-zinc-300 border border-zinc-700 mb-6">
          <span className={`h-2.5 w-2.5 rounded-full ${status.includes('successfully') ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{status}</span>
        </div>

        {employeeData && (
          <div className="w-full text-left bg-zinc-950 p-4 rounded border border-zinc-800 font-mono text-xs text-zinc-400 overflow-x-auto">
            <p className="font-semibold text-zinc-200 mb-2">Sample Record fetched:</p>
            <pre>{JSON.stringify(employeeData[0], null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;