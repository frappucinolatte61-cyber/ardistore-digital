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

// Admin Credentials Management with Database & Local Fallback
export const getAdminCredentials = async () => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data && data.username && data.password) {
        return {
          username: data.username,
          password: data.password,
          source: 'supabase',
        };
      }
    } catch (e) {
      console.warn('Failed to fetch admin credentials from Supabase:', e);
    }
  }

  return {
    username: localStorage.getItem('ardistore_admin_username') || 'admin',
    password: localStorage.getItem('ardistore_admin_password') || 'admin123',
    source: 'localStorage',
  };
};

export const updateAdminCredentials = async (username, password) => {
  const cleanUser = (username || '').trim();
  const cleanPass = (password || '').trim();
  let savedToCloud = false;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .upsert({
          id: 'primary-admin',
          username: cleanUser,
          password: cleanPass,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        savedToCloud = true;
      } else {
        console.warn('Supabase upsert admin_users error:', error);
      }
    } catch (err) {
      console.warn('Error saving admin_users to Supabase:', err);
    }
  }

  // Always update local storage
  localStorage.setItem('ardistore_admin_username', cleanUser);
  localStorage.setItem('ardistore_admin_password', cleanPass);

  return { success: true, savedToCloud };
};

export const verifyAdminLogin = async (inputUser, inputPassword) => {
  const cleanInputUser = (inputUser || '').trim().toLowerCase();
  const cleanInputPass = inputPassword || '';

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: dbUsers, error } = await supabase
        .from('admin_users')
        .select('*');

      if (!error && Array.isArray(dbUsers) && dbUsers.length > 0) {
        const matched = dbUsers.find((row) => {
          const dbUser = (row.username || '').trim().toLowerCase();
          const isUserMatch = (
            cleanInputUser === dbUser ||
            (dbUser.includes('@') && cleanInputUser === dbUser.split('@')[0]) ||
            (!dbUser.includes('@') && cleanInputUser === `${dbUser}@ardistore.digital`) ||
            cleanInputUser === 'admin'
          );
          return isUserMatch && cleanInputPass === row.password;
        });

        if (matched) {
          localStorage.setItem('ardistore_admin_username', matched.username);
          localStorage.setItem('ardistore_admin_password', matched.password);
          return { success: true, source: 'supabase', username: matched.username };
        }
      }
    } catch (e) {
      console.warn('Supabase verifyAdminLogin error:', e);
    }
  }

  // Local fallback
  const localUser = (localStorage.getItem('ardistore_admin_username') || 'admin').trim().toLowerCase();
  const localPass = localStorage.getItem('ardistore_admin_password') || 'admin123';

  const isLocalMatch = (
    cleanInputUser === localUser ||
    (localUser.includes('@') && cleanInputUser === localUser.split('@')[0]) ||
    (!localUser.includes('@') && cleanInputUser === `${localUser}@ardistore.digital`) ||
    cleanInputUser === 'admin'
  );

  if (isLocalMatch && cleanInputPass === localPass) {
    return { success: true, source: 'localStorage', username: localUser };
  }

  return { success: false };
};

// Upload media file (Image or Video) to Supabase Storage with local fallback
export const uploadProductMedia = async (file, folder = 'images') => {
  if (!file) throw new Error('File tidak ditemukan');

  const supabase = getSupabaseClient();
  const fileExt = file.name ? file.name.split('.').pop().toLowerCase() : (file.type?.startsWith('video') ? 'mp4' : 'jpg');
  const safeName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  // 1. If Supabase is connected, attempt upload to 'product-media' bucket
  if (supabase && supabase.storage) {
    try {
      const { data, error } = await supabase.storage
        .from('product-media')
        .upload(safeName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || undefined,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('product-media')
          .getPublicUrl(safeName);

        if (publicData && publicData.publicUrl) {
          return {
            success: true,
            url: publicData.publicUrl,
            source: 'supabase_storage',
          };
        }
      } else if (error) {
        console.warn('Supabase storage upload error:', error);
      }
    } catch (err) {
      console.warn('Supabase storage upload exception:', err);
    }
  }

  // 2. Fallback for images: convert to base64 Data URL
  if (file.type && file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          url: reader.result,
          source: 'local_data_url',
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // 3. Fallback for videos: convert to Data URL if under 15MB
  if (file.type && file.type.startsWith('video/') && file.size < 15 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          url: reader.result,
          source: 'local_data_url',
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  throw new Error('Gagal mengunggah file. Pastikan bucket "product-media" sudah dibuat di Supabase.');
};
