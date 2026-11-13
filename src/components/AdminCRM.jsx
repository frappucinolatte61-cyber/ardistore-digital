import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit3, Save, Database, LogOut, Check, 
  AlertCircle, Sparkles, RefreshCw, Eye, EyeOff, Search, Layers, 
  HelpCircle, Package, ArrowLeft, KeyRound, Shield, User, Lock, UserCheck,
  Play, Video, Camera, UploadCloud, Upload, Film, Trash
} from 'lucide-react';
import { 
  getSupabaseClient, 
  getAdminCredentials, 
  updateAdminCredentials, 
  verifyAdminLogin,
  uploadProductMedia
} from '../lib/supabaseClient';
import { CATEGORIES } from '../data/defaultProducts';

export default function AdminCRM({ 
  isOpen, 
  onClose, 
  products = [], 
  onSaveProduct, 
  onDeleteProduct, 
  onResetProducts,
  faqs = [],
  onSaveFaq,
  onDeleteFaq,
  onResetFaqs,
  onOpenSupabaseConfig,
  isSupabaseConnected 
}) {
  if (!isOpen) return null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ardistore_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Top Section: 'products' | 'faqs'
  const [activeSection, setActiveSection] = useState('products');

  // Sub-tab for Products: 'list' | 'form'
  const [activeProductTab, setActiveProductTab] = useState('list');
  const [filterCategory, setFilterCategory] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Sub-tab for FAQs: 'list' | 'form'
  const [activeFaqTab, setActiveFaqTab] = useState('list');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  // Form State for Products Add / Edit
  const [editingProductId, setEditingProductId] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'mlbb',
    price: 25000,
    unit: '',
    badge: '',
    image: '',
    videoUrl: '',
    galleryText: '',
    description: '',
    featuresText: '',
    isActive: true,
  });

  // Form State for FAQs Add / Edit
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
    isActive: true,
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  // Custom Admin Account Modal State (Username & Password)
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountUsernameInput, setAccountUsernameInput] = useState('');
  const [accountPasswordInput, setAccountPasswordInput] = useState('');
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [accountSaveStatus, setAccountSaveStatus] = useState('');
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Upload Loading States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState('');

  // Anti Brute-Force Rate Limiting State
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(sessionStorage.getItem('ardistore_login_fails') || '0', 10);
  });
  const [lockoutTime, setLockoutTime] = useState(() => {
    return parseInt(sessionStorage.getItem('ardistore_login_lockout') || '0', 10);
  });

  // Login handler with Supabase Database & Anti-Brute Force Protection
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Check if currently locked out
    if (lockoutTime > Date.now()) {
      const remainingSeconds = Math.ceil((lockoutTime - Date.now()) / 1000);
      setAuthError(`🛡️ Terlalu banyak percobaan salah! Akun terkunci sementara demi keamanan. Coba lagi dalam ${remainingSeconds} detik.`);
      return;
    }

    setAuthLoading(true);
    const supabase = getSupabaseClient();
    
    // 1. If Supabase is connected, attempt Supabase Auth first
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (!error && data.session) {
          setIsAuthenticated(true);
          sessionStorage.setItem('ardistore_admin_auth', 'true');
          sessionStorage.removeItem('ardistore_login_fails');
          sessionStorage.removeItem('ardistore_login_lockout');
          setFailedAttempts(0);
          setAuthLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase Auth error:', err);
      }
    }

    // 2. Check Database Table (admin_users) & Local Fallback via verifyAdminLogin
    try {
      const result = await verifyAdminLogin(loginEmail, loginPassword);
      if (result.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('ardistore_admin_auth', 'true');
        sessionStorage.removeItem('ardistore_login_fails');
        sessionStorage.removeItem('ardistore_login_lockout');
        setFailedAttempts(0);
        setAuthLoading(false);
        return;
      }
    } catch (err) {
      console.warn('verifyAdminLogin error:', err);
    }

    // Handle Login Failure & Increment Counter
    const newFails = failedAttempts + 1;
    setFailedAttempts(newFails);
    sessionStorage.setItem('ardistore_login_fails', newFails.toString());

    setAuthLoading(false);

    if (newFails >= 5) {
      const lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes lock
      setLockoutTime(lockUntil);
      sessionStorage.setItem('ardistore_login_lockout', lockUntil.toString());
      setAuthError('🛡️ Keamanan Diaktifkan: Terdeteksi 5x kesalahan login. Form login dibekukan selama 5 menit untuk mencegah pembobolan.');
    } else {
      setAuthError(`Username atau password salah! (Sisa percobaan: ${5 - newFails}x sebelum akun dikunci)`);
    }
  };

  // Open modal and pre-fill credentials from Database (admin_users) or localStorage
  const handleOpenAccountModal = async () => {
    setShowAccountModal(true);
    setAccountSaveStatus('');
    setIsSavingAccount(false);

    const localUser = localStorage.getItem('ardistore_admin_username') || 'admin';
    const localPass = localStorage.getItem('ardistore_admin_password') || '';
    setAccountUsernameInput(localUser);
    setAccountPasswordInput(localPass);

    try {
      const creds = await getAdminCredentials();
      if (creds) {
        if (creds.username) setAccountUsernameInput(creds.username);
        if (creds.password) setAccountPasswordInput(creds.password);
      }
    } catch (err) {
      console.warn('Failed to load admin credentials:', err);
    }
  };

  // Save new username and password to Database (admin_users) and localStorage
  const handleSaveAdminAccount = async (e) => {
    e.preventDefault();
    const cleanUser = accountUsernameInput.trim();
    const cleanPass = accountPasswordInput.trim();

    if (!cleanUser) {
      alert('Username admin tidak boleh kosong!');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      alert('Password baru minimal 6 karakter!');
      return;
    }

    setIsSavingAccount(true);
    setAccountSaveStatus('');

    try {
      const res = await updateAdminCredentials(cleanUser, cleanPass);
      setIsSavingAccount(false);

      if (res.savedToCloud) {
        setAccountSaveStatus('✅ Berhasil! Username & Password tersimpan ke Database Cloud Supabase & Browser.');
      } else {
        setAccountSaveStatus('✅ Berhasil! Tersimpan ke Browser Lokal (Database Cloud offline).');
      }

      setTimeout(() => {
        setAccountSaveStatus('');
        setShowAccountModal(false);
      }, 2000);
    } catch (err) {
      setIsSavingAccount(false);
      alert('Gagal menyimpan kredensial: ' + (err.message || 'Error'));
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    sessionStorage.removeItem('ardistore_admin_auth');
    setIsAuthenticated(false);
  };

  // --- PRODUCT HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductFormData({
      name: '',
      category: 'mlbb',
      price: 25000,
      unit: '',
      badge: '',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      videoUrl: '',
      galleryText: '',
      description: '',
      featuresText: 'Proses Cepat 5-10 Menit\n100% Bergaransi\nPelayanan Ramah 24 Jam',
      isActive: true,
    });
    setActiveProductTab('form');
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      unit: prod.unit || '',
      badge: prod.badge || '',
      image: prod.image || '',
      videoUrl: prod.videoUrl || prod.video_url || '',
      galleryText: Array.isArray(prod.gallery) ? prod.gallery.join('\n') : (prod.gallery || ''),
      description: prod.description || '',
      featuresText: (prod.features || []).join('\n'),
      isActive: prod.isActive !== false,
    });
    setActiveProductTab('form');
  };

  const handleSaveProductForm = (e) => {
    e.preventDefault();
    if (!productFormData.name.trim()) return;

    const featuresArray = productFormData.featuresText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const galleryArray = productFormData.galleryText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('/')));

    const productPayload = {
      id: editingProductId || `prod-${Date.now()}`,
      name: productFormData.name.trim(),
      category: productFormData.category,
      price: Number(productFormData.price) || 0,
      unit: productFormData.unit.trim(),
      badge: productFormData.badge.trim(),
      image: productFormData.image.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      videoUrl: productFormData.videoUrl.trim(),
      gallery: galleryArray,
      description: productFormData.description.trim(),
      features: featuresArray,
      isActive: productFormData.isActive,
    };

    onSaveProduct(productPayload);
    setActiveProductTab('list');
    setEditingProductId(null);
  };

  // --- MEDIA UPLOAD HANDLERS ---
  const handleUploadMainImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadFeedback('');
    try {
      const res = await uploadProductMedia(file, 'images');
      setProductFormData((prev) => ({ ...prev, image: res.url }));
      setUploadFeedback('✅ Foto utama berhasil diunggah!');
      setTimeout(() => setUploadFeedback(''), 3000);
    } catch (err) {
      alert('Gagal mengunggah foto: ' + (err.message || 'Error'));
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('Ukuran video maksimal 100 MB!');
      return;
    }

    setIsUploadingVideo(true);
    setUploadFeedback('');
    try {
      const res = await uploadProductMedia(file, 'videos');
      setProductFormData((prev) => ({ ...prev, videoUrl: res.url }));
      setUploadFeedback('✅ Video berhasil diunggah!');
      setTimeout(() => setUploadFeedback(''), 3000);
    } catch (err) {
      alert('Gagal mengunggah video: ' + (err.message || 'Error'));
    } finally {
      setIsUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleUploadGalleryImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    setUploadFeedback('');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const res = await uploadProductMedia(file, 'gallery');
        if (res.url) uploadedUrls.push(res.url);
      }

      setProductFormData((prev) => {
        const existingLines = prev.galleryText ? prev.galleryText.split('\n').filter(Boolean) : [];
        const merged = [...existingLines, ...uploadedUrls].join('\n');
        return { ...prev, galleryText: merged };
      });

      setUploadFeedback(`✅ Berhasil mengunggah ${uploadedUrls.length} foto ke galeri!`);
      setTimeout(() => setUploadFeedback(''), 3000);
    } catch (err) {
      alert('Gagal mengunggah foto galeri: ' + (err.message || 'Error'));
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setProductFormData((prev) => {
      const lines = prev.galleryText ? prev.galleryText.split('\n').filter(Boolean) : [];
      const updated = lines.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, galleryText: updated.join('\n') };
    });
  };

  // --- FAQ HANDLERS ---
  const handleOpenAddFaq = () => {
    setEditingFaqId(null);
    setFaqFormData({
      question: '',
      answer: '',
      isActive: true,
    });
    setActiveFaqTab('form');
  };

  const handleOpenEditFaq = (faq) => {
    setEditingFaqId(faq.id);
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive !== false,
    });
    setActiveFaqTab('form');
  };

  const handleSaveFaqForm = (e) => {
    e.preventDefault();
    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) return;

    const faqPayload = {
      id: editingFaqId || `faq-${Date.now()}`,
      question: faqFormData.question.trim(),
      answer: faqFormData.answer.trim(),
      isActive: faqFormData.isActive,
    };

    onSaveFaq(faqPayload);
    setActiveFaqTab('list');
    setEditingFaqId(null);
  };

  // Filters
  const filteredProducts = products.filter((p) => {
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchSearch = p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(productSearchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredFaqs = faqs.filter((f) => {
    return f.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
           f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#0d1322] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span>CRM Admin Panel</span>
                <span className="text-xs font-normal text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  Ardistore Digital
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Kelola katalog produk, daftar FAQ, harga, dan integrasi database Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                title="Keluar dari Admin"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0d16]">
          
          {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8">
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Login Admin Ardistore</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Masuk untuk mengelola produk &amp; pertanyaan FAQ.
                </p>

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username / Email Admin:
                    </label>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin atau email Anda..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password:
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        title={showLoginPassword ? "Sembunyikan password" : "Lihat password"}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
                  >
                    {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    <span>{authLoading ? 'Memverifikasi...' : 'Masuk ke CRM'}</span>
                  </button>

                  <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                    <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Portal Terproteksi • Khusus Administrator Resmi Ardistore Digital</span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-6">

              {/* Security Alert if still using default credentials */}
              {(!localStorage.getItem('ardistore_admin_password') || localStorage.getItem('ardistore_admin_password') === 'admin123') && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Perhatian: Akun admin masih menggunakan password default. Silakan atur username &amp; password pribadi Anda agar aman.</span>
                  </div>
                  <button
                    onClick={handleOpenAccountModal}
                    className="ml-3 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-[11px] font-bold shrink-0 transition-colors"
                  >
                    Atur Akun Sekarang
                  </button>
                </div>
              )}

              {/* Master Navigation: Produk vs FAQ */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setActiveSection('products');
                      setActiveProductTab('list');
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeSection === 'products'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Kelola Produk ({products.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('faqs');
                      setActiveFaqTab('list');
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeSection === 'faqs'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Kelola FAQ ({faqs.length})</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleOpenAccountModal}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium border bg-slate-800 text-slate-300 border-slate-700 hover:text-white flex items-center space-x-1.5 transition-colors"
                    title="Ubah Username & Password Admin (Tersimpan ke Database Supabase)"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ganti User &amp; Password</span>
                  </button>

                  <button
                    onClick={onOpenSupabaseConfig}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 ${
                      isSupabaseConnected
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950/40 text-amber-300 border-amber-800'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>{isSupabaseConnected ? 'Supabase Sync' : 'Setup Supabase'}</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 1: MANAJEMEN PRODUK */}
              {/* ========================================================= */}
              {activeSection === 'products' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveProductTab('list')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          activeProductTab === 'list'
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Semua Produk ({products.length})
                      </button>
                      <button
                        onClick={handleOpenAddProduct}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                          activeProductTab === 'form' && !editingProductId
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Produk Baru</span>
                      </button>
                    </div>

                    <button
                      onClick={onResetProducts}
                      className="text-xs text-slate-400 hover:text-rose-400 transition-colors self-start sm:self-auto"
                    >
                      Reset Katalog Default
                    </button>
                  </div>

                  {/* List View */}
                  {activeProductTab === 'list' && (
                    <div className="space-y-4">
                      {/* Search & Filter Toolbar */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={productSearchQuery}
                            onChange={(e) => setProductSearchQuery(e.target.value)}
                            placeholder="Cari produk di CRM..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                        >
                          <option value="all">Semua Kategori</option>
                          {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Products Table */}
                      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                              <tr>
                                <th className="p-3.5">Produk</th>
                                <th className="p-3.5">Kategori</th>
                                <th className="p-3.5">Harga</th>
                                <th className="p-3.5">Badge</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {filteredProducts.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="p-6 text-center text-slate-500">
                                    Tidak ada produk ditemukan.
                                  </td>
                                </tr>
                              ) : (
                                filteredProducts.map((prod) => (
                                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="p-3.5">
                                      <div className="flex items-center space-x-3">
                                        <img
                                          src={prod.image}
                                          alt={prod.name}
                                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                                          }}
                                        />
                                        <div>
                                          <p className="font-bold text-white line-clamp-1">{prod.name}</p>
                                          <div className="flex items-center space-x-2 mt-0.5">
                                            <p className="text-[11px] text-slate-400 line-clamp-1">{prod.description}</p>
                                            {(prod.videoUrl || prod.video_url) && (
                                              <span className="shrink-0 text-[10px] text-rose-400 flex items-center gap-0.5 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/60 font-semibold">
                                                <Play className="w-2.5 h-2.5 fill-rose-400" /> Video
                                              </span>
                                            )}
                                            {Array.isArray(prod.gallery) && prod.gallery.length > 0 && (
                                              <span className="shrink-0 text-[10px] text-cyan-400 flex items-center gap-0.5 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-900/60 font-semibold">
                                                <Camera className="w-2.5 h-2.5" /> +{prod.gallery.length}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3.5 uppercase font-semibold text-[10px] text-cyan-400">
                                      {prod.category}
                                    </td>
                                    <td className="p-3.5 font-bold text-emerald-400">
                                      {formatRupiah(prod.price)} <span className="text-[10px] text-slate-400 font-normal">{prod.unit}</span>
                                    </td>
                                    <td className="p-3.5">
                                      {prod.badge ? (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                                          {prod.badge}
                                        </span>
                                      ) : (
                                        <span className="text-slate-500">-</span>
                                      )}
                                    </td>
                                    <td className="p-3.5">
                                      <button
                                        onClick={() => onSaveProduct({ ...prod, isActive: !prod.isActive })}
                                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center space-x-1 ${
                                          prod.isActive !== false
                                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                                            : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}
                                      >
                                        {prod.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        <span>{prod.isActive !== false ? 'Aktif' : 'Non-aktif'}</span>
                                      </button>
                                    </td>
                                    <td className="p-3.5 text-right">
                                      <div className="flex items-center justify-end space-x-2">
                                        <button
                                          onClick={() => handleOpenEditProduct(prod)}
                                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
                                          title="Edit Produk"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (window.confirm(`Yakin ingin menghapus "${prod.name}"?`)) {
                                              onDeleteProduct(prod.id);
                                            }
                                          }}
                                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 border border-slate-700 transition-colors"
                                          title="Hapus Produk"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Add / Edit Product */}
                  {activeProductTab === 'form' && (
                    <div className="glass-card p-6 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                        <h3 className="text-base font-bold text-white flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>{editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}</span>
                        </h3>
                        <button
                          onClick={() => setActiveProductTab('list')}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Batal
                        </button>
                      </div>

                      <form onSubmit={handleSaveProductForm} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Nama Produk / Layanan: *
                            </label>
                            <input
                              type="text"
                              value={productFormData.name}
                              onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                              placeholder="Contoh: Netflix 4K UHD 1 Bulan"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Kategori: *
                            </label>
                            <select
                              value={productFormData.category}
                              onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                            >
                              <option value="mlbb">Mobile Legends</option>
                              <option value="premium-app">Aplikasi Premium</option>
                              <option value="sosmed">Sosial Media</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Harga (IDR): *
                            </label>
                            <input
                              type="number"
                              value={productFormData.price}
                              onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                              placeholder="25000"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Satuan / Unit (Opsional):
                            </label>
                            <input
                              type="text"
                              value={productFormData.unit}
                              onChange={(e) => setProductFormData({ ...productFormData, unit: e.target.value })}
                              placeholder="Contoh: / acc, / Season, / Bulan, / 1.000 Flw"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Badge Label (Opsional):
                            </label>
                            <input
                              type="text"
                              value={productFormData.badge}
                              onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                              placeholder="Contoh: Best Seller, Hot Deal, Populer"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div className="flex items-center space-x-3 pt-6">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={productFormData.isActive}
                                onChange={(e) => setProductFormData({ ...productFormData, isActive: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                              <span className="ml-3 text-xs font-medium text-slate-300">
                                {productFormData.isActive ? 'Produk Aktif (Tampil)' : 'Draft (Sembunyikan)'}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* UPLOAD FEEDBACK NOTIFICATION */}
                        {uploadFeedback && (
                          <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{uploadFeedback}</span>
                          </div>
                        )}

                        {/* 1. FOTO UTAMA DENGAN UPLOAD LANGSUNG */}
                        <div className="space-y-2.5 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                              <Camera className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Foto Utama Produk (Cover/Thumbnail):</span>
                            </label>
                            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all shrink-0">
                              {isUploadingImage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                              <span>{isUploadingImage ? 'Mengunggah Foto...' : 'Upload Foto (HP / PC)'}</span>
                              <input type="file" accept="image/*" onChange={handleUploadMainImage} className="hidden" disabled={isUploadingImage} />
                            </label>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={productFormData.image}
                              onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                              placeholder="Atau tempel URL gambar: https://images.unsplash.com/..."
                              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                              required
                            />
                            {productFormData.image && (
                              <div className="relative w-14 h-11 rounded-lg overflow-hidden border border-slate-700 shrink-0 group">
                                <img src={productFormData.image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setProductFormData({ ...productFormData, image: '' })}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                                  title="Hapus foto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Pilih file gambar langsung dari galeri HP / laptop Anda, atau tempel link URL foto online.
                          </p>
                        </div>

                        {/* 2. VIDEO DEMO DENGAN UPLOAD LANGSUNG (MP4 / YOUTUBE) */}
                        <div className="space-y-2.5 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                              <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                              <span>Video Demo / Tutorial (Opsional):</span>
                            </label>
                            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all shrink-0">
                              {isUploadingVideo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Film className="w-3.5 h-3.5" />}
                              <span>{isUploadingVideo ? 'Mengunggah Video...' : 'Upload Video (MP4 / WebM)'}</span>
                              <input type="file" accept="video/mp4,video/webm,video/quicktime,video/*" onChange={handleUploadVideo} className="hidden" disabled={isUploadingVideo} />
                            </label>
                          </div>

                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={productFormData.videoUrl}
                              onChange={(e) => setProductFormData({ ...productFormData, videoUrl: e.target.value })}
                              placeholder="Atau tempel link YouTube/Shorts: https://www.youtube.com/watch?v=..."
                              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            {productFormData.videoUrl && (
                              <button
                                type="button"
                                onClick={() => setProductFormData({ ...productFormData, videoUrl: '' })}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                                title="Hapus video"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Bisa upload file video langsung dari HP/komputer (MP4/WebM) atau masukkan link video dari YouTube &amp; YouTube Shorts.
                          </p>
                        </div>

                        {/* 3. GALERI FOTO TAMBAHAN DENGAN MULTI-UPLOAD */}
                        <div className="space-y-2.5 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                              <Camera className="w-3.5 h-3.5 text-purple-400" />
                              <span>Galeri Foto Tambahan (Opsional):</span>
                            </label>
                            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all shrink-0">
                              {isUploadingGallery ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>{isUploadingGallery ? 'Mengunggah Foto...' : 'Upload Banyak Foto Sekaligus'}</span>
                              <input type="file" accept="image/*" multiple onChange={handleUploadGalleryImages} className="hidden" disabled={isUploadingGallery} />
                            </label>
                          </div>

                          {/* Gallery Thumbnails List */}
                          {productFormData.galleryText && productFormData.galleryText.split('\n').filter(Boolean).length > 0 && (
                            <div className="flex items-center space-x-2.5 overflow-x-auto py-2">
                              {productFormData.galleryText.split('\n').filter(Boolean).map((url, gIdx) => (
                                <div key={gIdx} className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-700 shrink-0 group">
                                  <img src={url} alt={`Galeri ${gIdx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(gIdx)}
                                    className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                                    title="Hapus foto ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <textarea
                            rows={2}
                            value={productFormData.galleryText}
                            onChange={(e) => setProductFormData({ ...productFormData, galleryText: e.target.value })}
                            placeholder="Atau tempel daftar URL gambar (1 baris 1 URL):&#10;https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-mono"
                          />
                          <p className="text-[11px] text-slate-400">
                            Foto-foto ini akan muncul sebagai slider &amp; thumbnail saat pembeli membuka rincian produk.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Deskripsi Singkat:
                          </label>
                          <textarea
                            rows={2}
                            value={productFormData.description}
                            onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                            placeholder="Deskripsikan detail layanan produk ini..."
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Fitur &amp; Benefit (Pisahkan Tiap Baris):
                          </label>
                          <textarea
                            rows={3}
                            value={productFormData.featuresText}
                            onChange={(e) => setProductFormData({ ...productFormData, featuresText: e.target.value })}
                            placeholder="Proses 5-10 Menit&#10;100% Bergaransi&#10;Pelayanan 24/7"
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-3 border-t border-slate-800">
                          <button
                            type="submit"
                            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow-cyan flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>{editingProductId ? 'Simpan Perubahan' : 'Terbitkan Produk'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveProductTab('list')}
                            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION 2: MANAJEMEN FAQ */}
              {/* ========================================================= */}
              {activeSection === 'faqs' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveFaqTab('list')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          activeFaqTab === 'list'
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Semua FAQ ({faqs.length})
                      </button>
                      <button
                        onClick={handleOpenAddFaq}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                          activeFaqTab === 'form' && !editingFaqId
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Pertanyaan FAQ Baru</span>
                      </button>
                    </div>

                    <button
                      onClick={onResetFaqs}
                      className="text-xs text-slate-400 hover:text-rose-400 transition-colors self-start sm:self-auto"
                    >
                      Reset FAQ Default
                    </button>
                  </div>

                  {/* List View FAQs */}
                  {activeFaqTab === 'list' && (
                    <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={faqSearchQuery}
                          onChange={(e) => setFaqSearchQuery(e.target.value)}
                          placeholder="Cari pertanyaan atau jawaban FAQ..."
                          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* FAQ Cards / Table */}
                      <div className="space-y-3">
                        {filteredFaqs.length === 0 ? (
                          <div className="text-center py-10 glass-card rounded-2xl border border-slate-800 text-slate-500 text-xs">
                            Tidak ada pertanyaan FAQ ditemukan.
                          </div>
                        ) : (
                          filteredFaqs.map((faq, idx) => (
                            <div
                              key={faq.id}
                              className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-slate-700 transition-colors"
                            >
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <h4 className="font-bold text-white text-xs sm:text-sm">
                                    {faq.question}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                                  {faq.answer}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2 self-end sm:self-start shrink-0 pt-2 sm:pt-0">
                                <button
                                  onClick={() => onSaveFaq({ ...faq, isActive: !faq.isActive })}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border flex items-center space-x-1 ${
                                    faq.isActive !== false
                                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                                      : 'bg-slate-800 text-slate-400 border-slate-700'
                                  }`}
                                  title="Ubah visibilitas di landing page"
                                >
                                  {faq.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                  <span>{faq.isActive !== false ? 'Aktif' : 'Non-aktif'}</span>
                                </button>

                                <button
                                  onClick={() => handleOpenEditFaq(faq)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
                                  title="Edit Pertanyaan & Jawaban"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus FAQ: "${faq.question}"?`)) {
                                      onDeleteFaq(faq.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 border border-slate-700 transition-colors"
                                  title="Hapus FAQ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form Add / Edit FAQ */}
                  {activeFaqTab === 'form' && (
                    <div className="glass-card p-6 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                        <h3 className="text-base font-bold text-white flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          <span>{editingFaqId ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}</span>
                        </h3>
                        <button
                          onClick={() => setActiveFaqTab('list')}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Batal
                        </button>
                      </div>

                      <form onSubmit={handleSaveFaqForm} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Pertanyaan (Question): *
                          </label>
                          <input
                            type="text"
                            value={faqFormData.question}
                            onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                            placeholder="Contoh: Apakah akun Netflix bergaransi jika terjadi kendala?"
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-purple-400"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Jawaban Lengkap (Answer): *
                          </label>
                          <textarea
                            rows={4}
                            value={faqFormData.answer}
                            onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                            placeholder="Jelaskan jawaban secara detail dan meyakinkan pelanggan..."
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-purple-400"
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={faqFormData.isActive}
                              onChange={(e) => setFaqFormData({ ...faqFormData, isActive: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            <span className="ml-3 text-xs font-medium text-slate-300">
                              {faqFormData.isActive ? 'Tampilkan di Halaman Web' : 'Sembunyikan (Draft)'}
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center space-x-3 pt-3 border-t border-slate-800">
                          <button
                            type="submit"
                            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>{editingFaqId ? 'Simpan Perubahan FAQ' : 'Terbitkan FAQ'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveFaqTab('list')}
                            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* PENGATURAN AKUN ADMIN MODAL (USERNAME & PASSWORD) */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Pengaturan Akun Admin
                  </h3>
                  <p className="text-[11px] text-cyan-400">
                    Tersimpan di Cloud Database Supabase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Ubah <strong>Username</strong> dan <strong>Password</strong> login admin Anda. Perubahan akan langsung disimpan ke database cloud Supabase sehingga Anda bisa gonta-ganti akun dengan mudah dan login dari perangkat mana saja.
            </p>

            <form onSubmit={handleSaveAdminAccount} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Username Admin Baru:</span>
                </label>
                <input
                  type="text"
                  value={accountUsernameInput}
                  onChange={(e) => setAccountUsernameInput(e.target.value)}
                  placeholder="Contoh: admin, ardistore, atau email..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Bisa nama panggilan atau format email.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Password Baru (Min 6 Karakter):</span>
                </label>
                <div className="relative">
                  <input
                    type={showAccountPassword ? "text" : "password"}
                    value={accountPasswordInput}
                    onChange={(e) => setAccountPasswordInput(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full px-3 py-2 pr-9 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountPassword(!showAccountPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showAccountPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Gunakan kombinasi huruf &amp; angka agar tidak mudah ditebak.
                </span>
              </div>

              {accountSaveStatus && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{accountSaveStatus}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingAccount}
                  className="flex-1 py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-cyan flex items-center justify-center space-x-1.5 disabled:opacity-50 transition-all"
                >
                  {isSavingAccount ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Akun</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="py-2 px-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
