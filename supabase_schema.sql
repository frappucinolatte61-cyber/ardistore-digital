-- ========================================================================
-- ARDISTORE DIGITAL - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ========================================================================
-- Jalankan skrip ini pada menu 'SQL Editor' di Supabase Console (Free Tier)
-- Project: Ardistore Digital (Landing Page & CRM)
-- ========================================================================

-- 1. Buat Tabel Produk jika belum ada
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'mlbb' | 'premium-app' | 'sosmed'
    price BIGINT NOT NULL DEFAULT 0,
    unit TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    image TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk pencarian produk
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);

-- Aktifkan RLS Produk
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" 
ON public.products FOR UPDATE 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" 
ON public.products FOR DELETE 
TO authenticated 
USING (true);

-- 2. Buat Tabel FAQ (Pertanyaan yang Sering Diajukan)
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk FAQ
CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON public.faqs (is_active);

-- Aktifkan RLS FAQ
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active faqs" ON public.faqs;
CREATE POLICY "Public can view active faqs" 
ON public.faqs FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can insert faqs" ON public.faqs;
CREATE POLICY "Admins can insert faqs" 
ON public.faqs FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update faqs" ON public.faqs;
CREATE POLICY "Admins can update faqs" 
ON public.faqs FOR UPDATE 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Admins can delete faqs" ON public.faqs;
CREATE POLICY "Admins can delete faqs" 
ON public.faqs FOR DELETE 
TO authenticated 
USING (true);

-- 3. Trigger otomatis updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
