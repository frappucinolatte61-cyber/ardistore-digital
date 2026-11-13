-- ========================================================
-- TABEL ADMIN_USERS UNTUK ARDISTORE DIGITAL (SUPABASE)
-- Jalankan skrip ini di SQL Editor Supabase
-- ========================================================

-- 1. Buat Tabel admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id text PRIMARY KEY DEFAULT 'primary-admin',
  username text NOT NULL DEFAULT 'admin',
  password text NOT NULL DEFAULT 'admin123',
  updated_at timestamptz DEFAULT now()
);

-- 2. Masukkan Default Akun Admin Pertama Kali
INSERT INTO public.admin_users (id, username, password)
VALUES ('primary-admin', 'admin', 'admin123')
ON CONFLICT (id) DO NOTHING;

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Buka Kebijakan Akses untuk Admin CRM
DROP POLICY IF EXISTS "Allow select admin_users" ON public.admin_users;
CREATE POLICY "Allow select admin_users" ON public.admin_users 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update admin_users" ON public.admin_users;
CREATE POLICY "Allow update admin_users" ON public.admin_users 
FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow insert admin_users" ON public.admin_users;
CREATE POLICY "Allow insert admin_users" ON public.admin_users 
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete admin_users" ON public.admin_users;
CREATE POLICY "Allow delete admin_users" ON public.admin_users 
FOR DELETE USING (true);
