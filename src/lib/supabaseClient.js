import { createClient } from '@supabase/supabase-js';

// Retrieve credentials either from environment variables or from localStorage settings
export const getSupabaseConfig = () => {
  const localConfig = localStorage.getItem('ardistore_supabase_config');
  if (localConfig) {
    try {
      const parsed = JSON.parse(localConfig);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, source: 'localStorage' };
      }
    } catch (e) {
      console.warn('Failed to parse local supabase config', e);
    }
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey && !envUrl.includes('placeholder')) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  return null;
};

// Singleton Supabase instance
let supabaseInstance = null;

export const getSupabaseClient = () => {
  const config = getSupabaseConfig();
  if (!config) return null;

  if (!supabaseInstance || supabaseInstance.__url !== config.url) {
    supabaseInstance = createClient(config.url, config.anonKey);
    supabaseInstance.__url = config.url;
  }
  return supabaseInstance;
};

export const saveSupabaseConfigToStorage = (url, anonKey) => {
  localStorage.setItem('ardistore_supabase_config', JSON.stringify({ url, anonKey }));
  supabaseInstance = null; // reset to re-init
};

export const clearSupabaseConfigFromStorage = () => {
  localStorage.removeItem('ardistore_supabase_config');
  supabaseInstance = null;
};

// Database helper functions
export const testSupabaseConnection = async (url, anonKey) => {
  try {
    const testClient = createClient(url, anonKey);
    const { error } = await testClient.from('products').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message || 'Gagal tersambung ke Supabase' };
  }
};
