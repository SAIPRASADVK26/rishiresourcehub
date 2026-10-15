import React, { useState } from 'react';
import { X, Database, Check, Copy, Zap, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, syncAllCentersToSupabase } from '../lib/supabase';

export default function SupabaseModal({ isOpen, onClose, centers, onSyncSuccess }) {
  if (!isOpen) return null;

  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const sqlScript = `-- Supabase Database Schema for Rishi Internal Forms Hub
-- Run this in your Supabase Project -> SQL Editor -> Click 'Run'

create table if not exists hub_forms (
  id text primary key,
  center_id text not null,
  number text not null,
  title_ta text not null,
  title_en text not null,
  drive_url text not null,
  type text default 'PDF',
  size text default 'A4',
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table hub_forms enable row level security;

drop policy if exists "Allow internal staff full access" on hub_forms;

create policy "Allow internal staff full access"
on hub_forms
for all
to anon, authenticated
using (true)
with check (true);

alter publication supabase_realtime add table hub_forms;
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleBulkUpload = async () => {
    if (!isSupabaseConfigured) {
      alert('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file first.');
      return;
    }
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncAllCentersToSupabase(centers);
      if (res.success) {
        setSyncStatus(`Successfully uploaded ${res.count} forms to Supabase!`);
        if (onSyncSuccess) onSyncSuccess();
      } else {
        setSyncStatus(`Failed: ${res.error || res.message}`);
      }
    } catch (e) {
      setSyncStatus(`Error: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSupabaseConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <span>Supabase Cloud Database</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isSupabaseConfigured 
                  ? 'Connected & Realtime Sync Active' 
                  : 'Centralized cloud sync for all devices & Vercel'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Connection Status Card */}
          <div className={`p-4 rounded-2xl border ${
            isSupabaseConfigured
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/60 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-3 h-3 rounded-full shrink-0 ${
                isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`} />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm">
                  {isSupabaseConfigured ? 'Supabase Live Connected' : 'Local Storage Mode'}
                </p>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                  {isSupabaseConfigured 
                    ? 'All forms are synced directly to your cloud PostgreSQL database. Edits from desktop, mobile, and Vercel will reflect instantly in real-time!'
                    : 'Currently saving forms in browser storage and local file. Connect Supabase to enable instant sync across all phones, PCs, and Vercel.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Setup Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Setup Steps (Easy 3 Minutes)
            </h4>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex gap-3 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-700 flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-semibold text-slate-900">Create Free Supabase Project</p>
                <p className="text-slate-500 mt-0.5">Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">supabase.com</a> and create a new free project.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5 text-xs text-slate-700">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-700 flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Run SQL Table Script</p>
                  <p className="text-slate-500 mt-0.5">In Supabase Dashboard, click <b>SQL Editor</b>, paste this script, and click <b>Run</b>:</p>
                </div>
              </div>
              <div className="relative">
                <pre className="p-3 bg-slate-900 text-emerald-400 text-[11px] rounded-xl max-h-36 overflow-y-auto font-mono">
                  {sqlScript}
                </pre>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="absolute top-2 right-2 flex items-center gap-1.5 py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-semibold border border-slate-700 transition-all cursor-pointer shadow-xs"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex gap-3 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-700 flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-semibold text-slate-900">Add Keys to .env & Vercel</p>
                <p className="text-slate-500 mt-0.5">
                  Go to <b>Project Settings → API</b> and copy <b>Project URL</b> & <b>anon public key</b> into your <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">.env</code> file:
                </p>
                <pre className="mt-1.5 p-2 bg-slate-100 rounded-lg text-[11px] font-mono text-slate-800">
VITE_SUPABASE_URL=https://xyz.supabase.co&#10;VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
                </pre>
              </div>
            </div>
          </div>

          {/* Action: Bulk Upload Local Data to Supabase */}
          {isSupabaseConfigured && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBulkUpload}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{isSyncing ? 'Uploading to Supabase...' : 'Upload All Current Forms to Supabase'}</span>
              </button>
              {syncStatus && (
                <p className="text-xs text-center font-medium mt-2 text-slate-600">
                  {syncStatus}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>PostgreSQL · Realtime WebSocket · SSL Encrypted</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
