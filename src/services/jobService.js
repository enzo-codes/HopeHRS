import { supabase } from './supabaseClient';

function makeStamp(action, userId) {
  return `${action} BY ${userId} AT ${new Date().toISOString()}`;
}

export async function getJobs(userType) {
  let query = supabase
    .from('job')
    .select('jobCode, jobDesc, record_status, stamp')
    .order('jobCode');

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getDeletedJobs() {
  const { data, error } = await supabase
    .from('job')
    .select('jobCode, jobDesc, record_status, stamp')
    .eq('record_status', 'INACTIVE')
    .order('jobCode');
  if (error) throw error;
  return data;
}

export async function addJob(payload, userId) {
  const stamp = makeStamp('CREATED', userId);
  const { error } = await supabase
    .from('job')
    .insert([{ ...payload, record_status: 'ACTIVE', stamp }]);
  if (error) throw error;
}

export async function updateJob(jobCode, updates, userId) {
  const stamp = makeStamp('UPDATED', userId);
  const { error } = await supabase
    .from('job')
    .update({ ...updates, stamp })
    .eq('jobCode', jobCode);
  if (error) throw error;
}

export async function softDeleteJob(jobCode, userId) {
  const stamp = makeStamp('DEACTIVATED', userId);
  const { error } = await supabase
    .from('job')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('jobCode', jobCode);
  if (error) throw error;
}

export async function recoverJob(jobCode, userId) {
  const stamp = makeStamp('REACTIVATED', userId);
  const { error } = await supabase
    .from('job')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('jobCode', jobCode);
  if (error) throw error;
}