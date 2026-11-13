-- ========================================================
-- SETUP SUPABASE STORAGE BUCKET UNTUK FOTO & VIDEO PRODUK
-- Jalankan skrip ini di SQL Editor Supabase
-- ========================================================

-- 1. Buat bucket public 'product-media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-media', 
  'product-media', 
  true, 
  104857600, -- Limit 100MB per file
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'
  ]
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 104857600;

-- 2. Kebijakan Akses Baca (Publik bisa melihat foto & video)
DROP POLICY IF EXISTS "Public Media View" ON storage.objects;
CREATE POLICY "Public Media View" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-media');

-- 3. Kebijakan Akses Upload (Bisa upload langsung dari Admin CRM website)
DROP POLICY IF EXISTS "Public Media Upload" ON storage.objects;
CREATE POLICY "Public Media Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'product-media');

-- 4. Kebijakan Akses Update & Hapus
DROP POLICY IF EXISTS "Public Media Update" ON storage.objects;
CREATE POLICY "Public Media Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'product-media');

DROP POLICY IF EXISTS "Public Media Delete" ON storage.objects;
CREATE POLICY "Public Media Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'product-media');
