# 🚀 Ardistore Digital - Landing Page & Admin CRM

Platform Landing Page responsif, modern, dan berkecepatan tinggi untuk **Ardistore Digital**. Didesain khusus untuk katalog pricelist layanan Mobile Legends, Aplikasi Premium, dan Jasa Sosial Media dengan integrasi checkout WhatsApp otomatis serta Admin CRM berbasis **Supabase (Free Tier)**.

---

## 🌟 Fitur Utama

### 1. Landing Page (Customer Facing)
- **Desain Modern Cyberpunk / Dark Gaming**: Tampilan elegan dengan perpaduan warna Dark Slate, Neon Cyan, dan Emerald.
- **Katalog Pricelist Per-Kategori**:
  1. **Kebutuhan Mobile Legends**:
     - *Tutor Rank Vs Bot (Max 30, 75, & 99 Bintang)* - Rp 25.000
     - *Jasa Pembuatan Akun Rank Vs Bot (Warlit Only)* - Rp 3.000 / acc
     - *Script Game Guardian Full Feature (Season)* - Rp 50.000 / Season
     - *Tutor 1 Email Tertaut Banyak Akun MLBB* - Rp 25.000
     - *Tutor Download Resource 0%* - Rp 25.000
     - *App MLBB GM Edition* - Rp 15.000
  2. **Kebutuhan Aplikasi Premium**:
     - *Netflix 4K UHD (Sharing & Private)*
     - *Canva Pro Designer (1 Bulan & 1 Tahun)*
     - *Spotify Premium (Individual & Family Plan)*
     - *YouTube Premium & CapCut Pro VIP*
  3. **Kebutuhan Sosial Media**:
     - *Followers, Likes & Views Instagram*
     - *Followers TikTok Syarat Live & FYP Booster*
     - *Followers Threads by Instagram*
     - *Nomor Virtual WA Luar Negeri (Jasa OTP)*
     - *Followers & Review Marketplace (Shopee / Tokopedia)*
- **Integrasi WhatsApp Otomatis**:
  - Tombol order langsung menyusun format pesan rapi (Nama Produk, Kategori, Harga, Jumlah, Catatan Pembeli).
- **Search & Filter Real-Time**: Pencarian instan dan tab kategori tanpa reload halaman.
- **Modal Checkout Interaktif**: Pelanggan bisa menentukan jumlah pesanan (misal order 5 akun warlit) dan catatan khusus.
- **FAQ & Trust Badges**: Panduan cara order dan metode pembayaran lengkap (QRIS, BCA, DANA, GoPay, OVO).

### 2. Admin CRM Panel
- **Login Admin**: Mendukung autentikasi Supabase Auth atau password admin pribadi yang dapat diatur langsung di panel CRM.
- **Manajemen Produk (CRUD)**:
  - Tambah produk baru beserta URL foto, badge, deskripsi, harga, satuan, dan bullet points keunggulan.
  - Edit produk yang sudah ada secara langsung.
  - Hapus produk atau ubah status (Aktif / Non-aktif).
  - Fitur Reset ke Katalog Default.
- **Manajemen Pertanyaan FAQ (CRUD)**:
  - Buat pertanyaan FAQ baru beserta jawaban lengkap langsung dari panel CRM.
  - Edit teks pertanyaan atau jawaban kapan saja.
  - Atur visibilitas FAQ (Tampilkan / Sembunyikan draft) tanpa harus menghapus data.
  - Hapus pertanyaan FAQ atau kembalikan ke default bawaan.
- **Integrasi Supabase Cloud**:
  - Dukungan database Supabase gratis tanpa perlu kartu kredit untuk tabel `products` dan `faqs`.
  - Pengaturan URL & Anon Key langsung melalui modal UI tanpa harus edit file konfigurasi.
  - Fallback otomatis ke penyimpanan lokal browser jika Supabase belum dihubungkan.

---

## 🛠️ Tech Stack & DevOps Architecture

- **Frontend Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS 3 (Custom Dark Theme & Glassmorphism)
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL + Row Level Security)
- **Containerization**: Docker (Multi-stage build) + Docker Compose
- **Production Web Server**: Nginx Alpine (Gzip, Cache-Control, Security Headers)
- **CI/CD**: GitHub Actions workflow

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan di Mode Pengembangan (Local Dev)
```bash
# 1. Pastikan dependencies sudah terinstall
npm install

# 2. Jalankan server lokal
npm run dev
```
Akses di browser: `http://localhost:3000`

### 2. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist/` dan siap di-deploy ke hosting statis manapun (Vercel, Netlify, Cloudflare Pages, atau VPS).

---

## 🐳 Panduan DevOps & Docker Deployment

Aplikasi ini sudah dilengkapi konfigurasi production-ready multi-stage Docker.

### Menggunakan Docker Compose (Satu Perintah):
```bash
docker compose up -d --build
```
Aplikasi akan aktif di: `http://localhost:8080`

### Perintah Docker Standar:
```bash
# Build image
docker build -t ardistore-digital .

# Jalankan container
docker run -d -p 80:80 --name ardistore-web ardistore-digital
```

---

## 🗄️ Setup Database Supabase (Free Tier)

1. Buka [supabase.com](https://supabase.com) dan buat project baru gratis.
2. Buka menu **SQL Editor** di dashboard Supabase.
3. Jalankan skrip yang ada di file `supabase_schema.sql` (atau klik tombol **Setup Supabase** di navbar website untuk menyalin skrip SQL secara otomatis).
4. Masuk ke **Project Settings > API**, salin `Project URL` dan `anon / public API Key`.
5. Klik badge **Setup Supabase Free** di navbar atau CRM, lalu simpan kredensial tersebut. Sistem akan otomatis sinkron ke Supabase Cloud!

---

## 👤 Keamanan & Akses Akun Admin CRM
- **Login Admin**: Masuk melalui tombol "Portal Admin" di footer halaman.
- **Password Pribadi**: Anda dapat mengganti password admin langsung di dalam panel CRM melalui tombol **"Ganti Password"**.
- **Supabase Auth**: Untuk keamanan tingkat lanjut, Anda juga dapat menghubungkan sistem autentikasi email & password resmi via Supabase Auth.

---

## 📞 Kontak Layanan
- **WhatsApp**: Diarahkan otomatis ke nomor WhatsApp resmi CS melalui variabel lingkungan `VITE_WHATSAPP_NUMBER`.
- **Owner**: Ardistore Digital
