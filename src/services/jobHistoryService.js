import { supabase } from '../supabaseClient';

function makeStamp(action, userId) {
  return `${action} BY ${userId} AT ${new Date().toISOString()}`;
}

// GET job history rows for a specific employee
// ACTIVE only for USER; all for ADMIN/SUPERADMIN
export async function getJobHistory(empNo, userType) {
  let query = supabase
    .from('jobHistory')
    .select(`
      empNo,
      jobCode,
      effDate,
      salary,
      deptCode,
      record_status,
      stamp,
      job:jobCode ( jobDesc ),
      department:deptCode ( deptName )
    `)
    .eq('empNo', empNo)
    .order('effDate', { ascending: false });

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// GET all INACTIVE job history rows (for Deleted Items panel — ADMIN/SUPERADMIN only)
export async function getDeletedJobHistory() {
  const { data, error } = await supabase
    .from('jobHistory')
    .select(`
      empNo,
      jobCode,
      effDate,
      salary,
      deptCode,
      record_status,
      stamp,
      job:jobCode ( jobDesc ),
      department:deptCode ( deptName )
    `)
    .eq('record_status', 'INACTIVE')
    .order('empNo');

  if (error) throw error;
  return data;
}

// ADD a new job history row
// Composite PK: empNo + jobCode + effDate must be unique
export async function addJobHistory(payload, userId) {
  const stamp = makeStamp('CREATED', userId);
  const { error } = await supabase
    .from('jobHistory')
    .insert([{ ...payload, record_status: 'ACTIVE', stamp }]);
  if (error) throw error;
}

// EDIT a job history row — only salary and deptCode are editable
// (empNo, jobCode, effDate are part of the PK and cannot change)
export async function updateJobHistory(empNo, jobCode, effDate, updates, userId) {
  const stamp = makeStamp('UPDATED', userId);
  const { error } = await supabase
    .from('jobHistory')
    .update({ ...updates, stamp })
    .eq('empNo', empNo)
    .eq('jobCode', jobCode)
    .eq('effDate', effDate);
  if (error) throw error;
}

// SOFT DELETE a single job history row using composite PK
export async function softDeleteJobHistory(empNo, jobCode, effDate, userId) {
  const stamp = makeStamp('DEACTIVATED', userId);
  const { error } = await supabase
    .from('jobHistory')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('empNo', empNo)
    .eq('jobCode', jobCode)
    .eq('effDate', effDate);
  if (error) throw error;
}

// RECOVER a single job history row
export async function recoverJobHistory(empNo, jobCode, effDate, userId) {
  const stamp = makeStamp('REACTIVATED', userId);
  const { error } = await supabase
    .from('jobHistory')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('empNo', empNo)
    .eq('jobCode', jobCode)
    .eq('effDate', effDate);
  if (error) throw error;
}