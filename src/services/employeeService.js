import { supabase } from './supabaseClient';

// Builds a stamp string for audit trail
function makeStamp(action, userId) {
  return `${action} BY ${userId} AT ${new Date().toISOString()}`;
}

// GET all employees — ACTIVE only for USER; all rows for ADMIN/SUPERADMIN
export async function getEmployees(userType) {
  let query = supabase
    .from('employee')
    .select('empno, lastname, firstname, gender, birthdate, hiredate, sepDate, record_status, stamp')
    .order('empno');

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// GET all INACTIVE employees (for DeletedItemsPage — ADMIN/SUPERADMIN only)
export async function getDeletedEmployees() {
  const { data, error } = await supabase
    .from('employee')
    .select('empno, lastname, firstname, gender, birthdate, hiredate, sepDate, record_status, stamp')
    .eq('record_status', 'INACTIVE')
    .order('empno');
  if (error) throw error;
  return data;
}

// ADD a new employee
export async function addEmployee(employeeData, userId) {
  const stamp = makeStamp('CREATED', userId);
  const { error } = await supabase
    .from('employee')
    .insert([{ ...employeeData, record_status: 'ACTIVE', stamp }]);
  if (error) throw error;
}

// EDIT an existing employee (does not touch record_status)
export async function updateEmployee(empno, updates, userId) {
  const stamp = makeStamp('UPDATED', userId);
  const { error } = await supabase
    .from('employee')
    .update({ ...updates, stamp })
    .eq('empno', empno);
  if (error) throw error;
}

// SOFT DELETE — sets record_status = 'INACTIVE'
export async function softDeleteEmployee(empno, userId) {
  const stamp = makeStamp('DEACTIVATED', userId);
  const { error } = await supabase
    .from('employee')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('empno', empno);
  if (error) throw error;
}

// RECOVER — sets record_status = 'ACTIVE'
export async function recoverEmployee(empno, userId) {
  const stamp = makeStamp('REACTIVATED', userId);
  const { error } = await supabase
    .from('employee')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('empno', empno);
  if (error) throw error;
}