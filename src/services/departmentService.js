import { supabase } from './supabaseClient';

function makeStamp(action, userId) {
  return `${action} BY ${userId} AT ${new Date().toISOString()}`;
}

export async function getDepts(userType) {
  let query = supabase
    .from('department')
    .select('deptCode, deptName, record_status, stamp')
    .order('deptCode');

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getDeletedDepts() {
  const { data, error } = await supabase
    .from('department')
    .select('deptCode, deptName, record_status, stamp')
    .eq('record_status', 'INACTIVE')
    .order('deptCode');
  if (error) throw error;
  return data;
}

export async function addDept(payload, userId) {
  const stamp = makeStamp('CREATED', userId);
  const { error } = await supabase
    .from('department')
    .insert([{ ...payload, record_status: 'ACTIVE', stamp }]);
  if (error) throw error;
}

export async function updateDept(deptCode, updates, userId) {
  const stamp = makeStamp('UPDATED', userId);
  const { error } = await supabase
    .from('department')
    .update({ ...updates, stamp })
    .eq('deptCode', deptCode);
  if (error) throw error;
}

export async function softDeleteDept(deptCode, userId) {
  const stamp = makeStamp('DEACTIVATED', userId);
  const { error } = await supabase
    .from('department')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('deptCode', deptCode);
  if (error) throw error;
}

export async function recoverDept(deptCode, userId) {
  const stamp = makeStamp('REACTIVATED', userId);
  const { error } = await supabase
    .from('department')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('deptCode', deptCode);
  if (error) throw error;
}