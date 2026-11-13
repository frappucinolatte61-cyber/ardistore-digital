export const DEFAULT_WHATSAPP = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WHATSAPP_NUMBER) || '628980503699';

export const CATEGORIES = [
  { id: 'all', label: 'Semua Layanan', icon: 'Sparkles' },
  { id: 'mlbb', label: 'Mobile Legends', icon: 'Gamepad2' },
  { id: 'premium-app', label: 'Aplikasi Premium', icon: 'Crown' },
  { id: 'sosmed', label: 'Sosial Media', icon: 'Share2' },
];

export const INITIAL_PRODUCTS = [
  // --- KEBUTUHAN MOBILE LEGENDS ---
  {
    id: 'mlbb-tutor-bot-30',
    name: 'Tutor Rank Vs Bot (Max 30 Bintang)',
    category: 'mlbb',
    price: 25000,
    unit: 'Metode',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    description: 'Panduan dan tutorial khusus cara matchmaking rank bertemu bot 100% winrate hingga tier Mythic 30 bintang.',
    features: [
      'Cocok untuk Mythic awal (bintang 0-30)',
      '100% musuh bot tidak melawan',
      'Aman tanpa banned, metode legal in-game',
      'Full bimbingan via WA sampai berhasil'
    ],
    isActive: true,
  },
  {
    id: 'mlbb-tutor-bot-75',
    name: 'Tutor Rank Vs Bot (Max 75 Bintang)',
    category: 'mlbb',
    price: 25000,
    unit: 'Metode',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    description: 'Trik ampuh push rank Mythical Honor hingga Mythical Glory 75 bintang tanpa stres ketemu dark system.',
    features: [
      'Bisa tembus hingga 75 bintang',
      'Metode matchmaking khusus',
      'Winrate hero & statistik melesat tinggi',
      'Garansi konsultasi sampai paham'
    ],
    isActive: true,
  },
  {
    id: 'mlbb-tutor-bot-99',
    name: 'Tutor Rank Vs Bot (Max 99 Bintang)',
    category: 'mlbb',
    price: 25000,
    unit: 'Metode',
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    description: 'Tutorial pamungkas push rank hingga Mythical Immortal 99 bintang dengan sistem anti-lose.',
    features: [
      'Push rank tembus Immortal (99 bintang)',
      'Cocok untuk joki maupun solo player',
      'Fast match tanpa antre lama',
      'Panduan step-by-step video & teks'
    ],
    isActive: true,
  },
  {
    id: 'mlbb-akun-warlit',
    name: 'Jasa Pembuatan Akun Rank Vs Bot (Warlit Only)',
    category: 'mlbb',
    price: 3000,
    unit: '/ acc',
    badge: 'Murah Meriah',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    description: 'Pembuatan akun khusus siap pakai tier Warrior - Elite dengan settingan matchmaking bot permanen.',
    features: [
      'Tier Warrior & Elite Only (Warlit)',
      'Langsung siap dipakai main/gb winrate',
      'Email kosongan / clean login',
      'Minimal order fleksibel'
    ],
    isActive: true,
  },
  {
    id: 'mlbb-script-gg',
    name: 'Script Game Guardian Full Feature',
    category: 'mlbb',
    price: 50000,
    unit: '/ Season',
    badge: 'Pro Script',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'Paket script GG premium terlengkap dengan fitur update berkala selama satu season penuh.',
    features: [
      'Skip Time & One Hit Setting',
      'KDA Setting & Statistik manipulasi',
      'Teleport Tower & Hit Tower In Base',
      'Stop Resource Download 0%',
      'Anti-banned system bypass & script loader'
    ],
    isActive: true,
  },
  {
    id: 'mlbb-tutor-multi-acc',
    name: 'Tutor 1 Email Tertaut Banyak Akun MLBB',
    category: 'mlbb',
    price: 25000,
    unit: 'Tutorial',
    badge: 'Recommended',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    description: 'Trik rahasia mengaitkan puluhan akun Mobile Legends hanya dengan 1 alamat email utama tanpa ribet.',
    features: [
      'Kelola banyak akun dalam 1 gmail',
      'Sangat efisien untuk penjual akun & joki',
      'Anti bentrok, verifikasi 2 langkah aman',
      'Bisa diterapkan berkali-kali sepuasnya'
    ],
    isActive: true,
  },
  {
    id: 'mlbb-tutor-resource-0',
    name: 'Tutor Download Resource 0%',
    category: 'mlbb',
    price: 25000,
    unit: 'Tutorial',
    badge: 'Hemat Storage',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'Solusi penyimpanan HP penuh! Mainkan MLBB lancar jaya dengan resource 0% tanpa harus download bergiga-giga.',
    features: [
      'Hemat storage hingga 10+ GB',
      'HP kentang jadi ringan & anti lag',
      'Efek skill hero tetap jalan normal',
      'Bisa digunakan di semua tipe smartphone'
    ],
    isActive: true,
  },
  {
    id: 'mlbb-app-gm',
    name: 'App MLBB GM Edition',
    category: 'mlbb',
    price: 15000,
    unit: 'Aplikasi',
    badge: 'Eksklusif',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    description: 'Aplikasi pembantu khusus dengan fitur kontrol game master untuk analisis gameplay dan kustomisasi.',
    features: [
      'Interface simpel & mudah digunakan',
      'Unlock mode latihan & skin preview',
      'Instalasi mudah tanpa root',
      'Support update patch terbaru'
    ],
    isActive: true,
  },

  // --- KEBUTUHAN APLIKASI PREMIUM ---
  {
    id: 'app-netflix-sharing',
    name: 'Netflix Premium 4K UHD (Sharing 1P)',
    category: 'premium-app',
    price: 25000,
    unit: '/ Bulan',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    description: 'Akun Netflix kualitas 4K Ultra HD. 1 Profil 1 User khusus pin pribadi anti tercampur.',
    features: [
      'Resolusi Ultra HD (4K)',
      '1 Profil milik Anda sendiri (bisa kunci PIN)',
      'Support Android, iOS, Smart TV, Laptop',
      'Garansi full 30 hari anti on-hold'
    ],
    isActive: true,
  },
  {
    id: 'app-netflix-private',
    name: 'Netflix Premium 4K UHD (Private 5P)',
    category: 'premium-app',
    price: 85000,
    unit: '/ Bulan',
    badge: 'Private',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80',
    description: 'Akun Netflix Full Private 1 Akun utuh dengan 5 profil bebas pakai bersama keluarga/teman.',
    features: [
      'Full 1 Akun 5 Profil milik sendiri',
      'Bisa nonton di 4 device bersamaan',
      'Bebas ganti password & profil',
      'Garansi penuh anti limit'
    ],
    isActive: true,
  },
  {
    id: 'app-canva-pro-1m',
    name: 'Canva Pro Designer (1 Bulan)',
    category: 'premium-app',
    price: 15000,
    unit: '/ Bulan',
    badge: 'Desain Bebas',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    description: 'Upgrade akun Canva pribadi menjadi Pro dengan akses jutaan elemen, template, & Magic AI.',
    features: [
      'Upgrade langsung via email pribadi Anda',
      'Bebas unduh PNG transparan & resize',
      'Akses 100+ juta foto, font, & elemen premium',
      'Garansi 30 hari penuh'
    ],
    isActive: true,
  },
  {
    id: 'app-canva-pro-1y',
    name: 'Canva Pro Designer (1 Tahun)',
    category: 'premium-app',
    price: 35000,
    unit: '/ Tahun',
    badge: 'Hemat 80%',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'Langganan Canva Pro 1 tahun penuh tanpa pusing perpanjang tiap bulan. Sangat hemat!',
    features: [
      'Masa aktif 1 Tahun (12 Bulan)',
      'Semua fitur Pro & AI terbuka',
      'Garansi replace jika ada kendala',
      'Koleksi template ribuan tanpa watermark'
    ],
    isActive: true,
  },
  {
    id: 'app-spotify-individual',
    name: 'Spotify Premium Individual (1 Bulan)',
    category: 'premium-app',
    price: 18000,
    unit: '/ Bulan',
    badge: 'Anti Iklan',
    image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&auto=format&fit=crop&q=80',
    description: 'Dengarkan musik tanpa jeda iklan, unduh lagu offline, dan kualitas audio tertinggi.',
    features: [
      'Bisa untuk akun baru maupun akun lama',
      'Bebas skip lagu tak terbatas & no ads',
      'Download musik untuk dengar offline',
      'Kualitas audio Extreme 320kbps'
    ],
    isActive: true,
  },
  {
    id: 'app-youtube-premium',
    name: 'YouTube Premium + YT Music (1 Bulan)',
    category: 'premium-app',
    price: 15000,
    unit: '/ Bulan',
    badge: 'Populer',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
    description: 'Nonton video YouTube tanpa iklan, putar di latar belakang, dan akses YouTube Music Premium.',
    features: [
      'Bebas iklan menyebalkan di semua video',
      'Putar video saat layar HP mati / background play',
      'Termasuk YouTube Music Premium gratis',
      'Sistem invite family legal & aman'
    ],
    isActive: true,
  },
  {
    id: 'app-capcut-pro',
    name: 'CapCut Pro VIP (1 Bulan)',
    category: 'premium-app',
    price: 20000,
    unit: '/ Bulan',
    badge: 'Editor',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    description: 'Buka semua efek pro, transisi viral, auto-caption canggih, dan hapus background otomatis.',
    features: [
      'Akses semua efek & filter Pro',
      'Cloud storage 100GB untuk simpan aset',
      'Ekspor 4K tanpa watermark Pro',
      'Bisa login di HP & PC'
    ],
    isActive: true,
  },

  // --- KEBUTUHAN SOSIAL MEDIA ---
  {
    id: 'sosmed-ig-followers',
    name: '1.000 Followers Instagram (Aktif / Mix)',
    category: 'sosmed',
    price: 35000,
    unit: '/ 1.000 Flw',
    badge: 'Terlaris',
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&auto=format&fit=crop&q=80',
    description: 'Tingkatkan kredibilitas akun olshop atau personal branding dengan followers berkualitas tinggi.',
    features: [
      'Hanya butuh Username IG (Tanpa Password)',
      'Akun ada foto profil & postingan',
      'Proses masuk bertahap (aman dari banned)',
      'Garansi refill 30 hari jika drop'
    ],
    isActive: true,
  },
  {
    id: 'sosmed-ig-likes-views',
    name: 'Paket 1.000 Likes + 10.000 Views IG Reels',
    category: 'sosmed',
    price: 15000,
    unit: '/ Paket',
    badge: 'Viral Booster',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&auto=format&fit=crop&q=80',
    description: 'Dorong postingan atau video Reels Anda masuk explore dan FYP dengan jutaan impresi.',
    features: [
      '1.000 Likes realis pada foto/reels',
      '10.000 Views video Reels instan',
      'Tingkatkan engagement rate postingan',
      'Hanya perlu link postingan saja'
    ],
    isActive: true,
  },
  {
    id: 'sosmed-tiktok-followers',
    name: '1.000 Followers TikTok (Syarat Live)',
    category: 'sosmed',
    price: 45000,
    unit: '/ 1.000 Flw',
    badge: 'Syarat Live',
    image: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=600&auto=format&fit=crop&q=80',
    description: 'Penuhi syarat 1.000 followers TikTok agar akun Anda langsung bisa Live Streaming & jualan di TikTok Shop.',
    features: [
      'Bisa unlock fitur LIVE TikTok',
      'Bisa daftar TikTok Shop Creator',
      'Tanpa password, hanya username TikTok',
      'Proses cepat 1x24 jam masuk tuntas'
    ],
    isActive: true,
  },
  {
    id: 'sosmed-tiktok-views',
    name: '10.000 Views Video TikTok (FYP Booster)',
    category: 'sosmed',
    price: 5000,
    unit: '/ 10k Views',
    badge: 'Super Murah',
    image: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=600&auto=format&fit=crop&q=80',
    description: 'Banjiri VT TikTok Anda dengan puluhan ribu views agar algoritma melipatgandakan sebaran video.',
    features: [
      '10.000 Views per link video',
      'Proses instan hitungan menit',
      'Meningkatkan retensi dan algoritma FYP',
      'Hanya butuh link VT saja'
    ],
    isActive: true,
  },
  {
    id: 'sosmed-threads-followers',
    name: '500 Followers Threads by Instagram',
    category: 'sosmed',
    price: 25000,
    unit: '/ 500 Flw',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'Bangun reputasi di platform baru Threads agar profil Anda terlihat kredibel dan ramai interaksi.',
    features: [
      'Kualitas akun high quality',
      'Hanya perlu username Threads',
      'Proses aman & bergaransi',
      'Membantu naikin reach tweet/threads'
    ],
    isActive: true,
  },
  {
    id: 'sosmed-wa-otp',
    name: 'Nomor Virtual WA Luar Negeri (Jasa OTP)',
    category: 'sosmed',
    price: 15000,
    unit: '/ Nomor',
    badge: 'Privasi',
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&auto=format&fit=crop&q=80',
    description: 'Sewa nomor luar negeri (USA, UK, Malaysia, dll) untuk verifikasi kode OTP WhatsApp baru atau kedua.',
    features: [
      'Nomor aktif siap terima kode SMS OTP',
      'Bisa pilih kode negara (USA/Eropa/Asia)',
      'Cocok untuk akun bisnis / kloning WA',
      'Garansi ganti nomor bila OTP gagal'
    ],
    isActive: true,
  },
  {
    id: 'sosmed-marketplace-shopee-toped',
    name: 'Followers Toko Shopee / Tokopedia (1.000 Flw)',
    category: 'sosmed',
    price: 30000,
    unit: '/ 1.000 Flw',
    badge: 'Trust Toko',
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80',
    description: 'Tingkatkan kepercayaan calon pembeli di toko online Anda dengan jumlah followers yang meyakinkan.',
    features: [
      'Support link toko Shopee maupun Tokopedia',
      'Meningkatkan conversion rate penjualan',
      'Hanya butuh link toko online',
      'Aman tanpa akses login toko'
    ],
    isActive: true,
  },
  {
    id: 'sosmed-marketplace-review',
    name: 'Jasa Review / Rating Bintang 5 Marketplace',
    category: 'sosmed',
    price: 5000,
    unit: '/ Ulasan',
    badge: 'Kredibilitas',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    description: 'Tingkatkan skor reputasi produk dengan ulasan bintang 5 lengkap beserta foto dan testimoni positif.',
    features: [
      'Akun pembeli aktif & natural',
      'Bisa kustom teks review & foto',
      'Menaikkan badge Star Seller / Power Merchant',
      'Garansi tidak terhapus sistem'
    ],
    isActive: true,
  }
];

export const INITIAL_FAQS = [
  {
    id: 'faq-1',
    question: 'Apakah Tutor Rank Vs Bot MLBB aman dari banned?',
    answer: 'Sangat aman! Metode yang digunakan adalah trik matchmaking sistem game Mobile Legends tanpa script cheat yang merusak file game, sehingga aman 100% dan tidak berisiko suspend/banned.',
    isActive: true,
  },
  {
    id: 'faq-2',
    question: 'Berapa lama proses pembuatan akun atau pengiriman aplikasi?',
    answer: 'Untuk akun Warlit dan App Premium (Netflix, Canva, Spotify), proses rata-rata selesai dalam 5-15 menit setelah konfirmasi pembayaran berhasil diverifikasi oleh admin.',
    isActive: true,
  },
  {
    id: 'faq-3',
    question: 'Bagaimana sistem garansi di Ardistore Digital?',
    answer: 'Semua produk memiliki garansi! Jika akun mengalami kendala atau tutor belum dipahami, admin kami akan membimbing secara personal atau memberikan replace akun baru.',
    isActive: true,
  },
  {
    id: 'faq-4',
    question: 'Metode pembayaran apa saja yang diterima?',
    answer: 'Kami menerima QRIS All Payment (BCA, Mandiri, BRI, BNI, DANA, GoPay, OVO, ShopeePay, LinkAja) sehingga Anda bisa membayar dari bank atau e-wallet mana saja secara instan.',
    isActive: true,
  },
];

