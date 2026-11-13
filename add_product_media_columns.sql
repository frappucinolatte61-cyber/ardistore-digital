-- ========================================================
-- TAMBAH KOLOM VIDEO & GALERI PADA TABEL PRODUCTS
-- Jalankan skrip ini di SQL Editor Supabase
-- ========================================================

-- 1. Tambah kolom video_url (untuk link YouTube, Shorts, atau MP4 video demo)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS video_url text DEFAULT '';

-- 2. Tambah kolom gallery (untuk foto-foto tambahan produk dalam format JSON array)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb;
