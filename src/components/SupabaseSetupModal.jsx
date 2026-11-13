import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfigToStorage, clearSupabaseConfigFromStorage, testSupabaseConnection } from '../lib/supabaseClient';

export const SUPABASE_SQL_SCRIPT = `-- ==========================================
-- SKEMA DATABASE ARDISTORE DIGITAL (SUPABASE)
-- Jalankan skrip ini di SQL Editor Supabase Anda
-- ==========================================

-- 1. Buat Tabel Produk
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price BIGINT NOT NULL,
    unit TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    image TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert products" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update products" 
ON public.products FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admins can delete products" 
ON public.products FOR DELETE 
TO authenticated 
USING (true);

-- 2. Buat Tabel FAQ
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public faqs are viewable by everyone" 
ON public.faqs FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert faqs" 
ON public.faqs FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update faqs" 
ON public.faqs FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admins can delete faqs" 
ON public.faqs FOR DELETE 
TO authenticated 
USING (true);
`;

export default function SupabaseSetupModal({ isOpen, onClose, onConfigSaved }) {
  if (!isOpen) return null;

  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig?.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig?.anonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url || !anonKey) {
      setTestResult({ success: false, message: 'Harap isi Project URL dan Anon Key!' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection(url.trim(), anonKey.trim());
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      saveSupabaseConfigToStorage(url.trim(), anonKey.trim());
      if (onConfigSaved) onConfigSaved();
    }
  };

  const handleResetToLocal = () => {
    clearSupabaseConfigFromStorage();
    setUrl('');
    setAnonKey('');
    setTestResult({ success: true, message: 'Koneksi dikembalikan ke Penyimpanan Lokal (Offline/Local Storage).' });
    if (onConfigSaved) onConfigSaved();
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-gradient-to-r from-emerald-950/40 to-slate-900">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Konfigurasi Database Supabase (Free Tier)</h3>
            <p className="text-xs text-slate-400">Hubungkan landing page &amp; CRM langsung ke Supabase Cloud</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Petunjuk Singkat */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-emerald-400 flex items-center space-x-1.5">
              <span>💡 Langkah Setup Supabase Gratis (3 Menit):</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center">supabase.com <ExternalLink className="w-3 h-3 ml-0.5" /></a> dan buat project baru (gratis).</li>
              <li>Buka menu <strong>SQL Editor</strong> di dashboard Supabase, paste skrip SQL di bawah, lalu klik <strong>Run</strong>.</li>
              <li>Buka <strong>Project Settings &gt; API</strong>, salin <code>Project URL</code> dan <code>anon/public API Key</code>, lalu masukkan ke form di bawah ini.</li>
            </ol>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project URL (Supabase):
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                API Key (anon / public):
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                testResult.success
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                  : 'bg-rose-950/40 text-rose-300 border-rose-800'
              }`}>
                {testResult.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message || (testResult.success ? 'Koneksi ke Supabase Berhasil dan Tersimpan!' : 'Koneksi gagal')}</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={isTesting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                <span>{isTesting ? 'Menguji Koneksi...' : 'Simpan & Hubungkan'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToLocal}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                title="Gunakan penyimpanan browser lokal tanpa akun Supabase"
              >
                Gunakan Mode Offline (Lokal)
              </button>
            </div>
          </form>

          {/* Script SQL Supabase Ready to Copy */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Skrip SQL Tabel &amp; RLS Supabase:</span>
              <button
                onClick={handleCopySQL}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl text-[11px] text-slate-400 font-mono overflow-x-auto max-h-40 border border-slate-800">
              {SUPABASE_SQL_SCRIPT}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
