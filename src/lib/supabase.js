import { createClient } from '@supabase/supabase-js';

// Production credentials fallback for Rishi Forms Hub Supabase
const DEFAULT_SUPABASE_URL = 'https://yagpullpaumonyooiwau.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZ3B1bGxwYXVtb255b29pd2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NzE1MjEsImV4cCI6MjEwNTU0NzUyMX0.CVinHHn-NMsFM5u0oX5JpspnPAvzJyX3t_nafX9X6fg';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fetch all forms from Supabase hub_forms table
export async function fetchFormsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('hub_forms')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching forms from Supabase:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase fetch failed:', err);
    return null;
  }
}

// Upsert a form to Supabase
export async function upsertFormToSupabase(formRow) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('hub_forms')
      .upsert(formRow, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error saving form to Supabase:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Supabase upsert failed:', err);
    throw err;
  }
}

// Batch upsert multiple forms to Supabase
export async function batchUpsertFormsToSupabase(formsRows) {
  if (!supabase || !formsRows || formsRows.length === 0) return true;
  try {
    const { data, error } = await supabase
      .from('hub_forms')
      .upsert(formsRows, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error batch updating forms in Supabase:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Supabase batch upsert failed:', err);
    throw err;
  }
}

// Delete a form from Supabase
export async function deleteFormFromSupabase(formId) {
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from('hub_forms')
      .delete()
      .eq('id', formId);

    if (error) {
      console.error('Error deleting form from Supabase:', error);
      throw error;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete failed:', err);
    throw err;
  }
}

// Bulk seed or sync all forms to Supabase
export async function syncAllCentersToSupabase(centers) {
  if (!supabase) return { success: false, message: 'Supabase not configured' };
  try {
    const rows = [];
    centers.forEach(center => {
      (center.forms || []).forEach((form, idx) => {
        rows.push({
          id: form.id,
          center_id: center.id,
          number: form.number,
          title_ta: form.titleTa,
          title_en: form.titleEn,
          drive_url: form.driveUrl,
          type: form.type || 'PDF',
          size: form.size || 'A4',
          sort_order: idx + 1
        });
      });
    });

    const { data, error } = await supabase
      .from('hub_forms')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: rows.length };
  } catch (err) {
    console.error('Bulk sync failed:', err);
    return { success: false, error: err.message };
  }
}

// Subscribe to real-time changes
export function subscribeToForms(onUpdate) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('hub_forms_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'hub_forms' },
      (payload) => {
        if (onUpdate) {
          onUpdate(payload);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
