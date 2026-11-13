import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import ProductsSection from './components/ProductsSection';
import CheckoutModal from './components/CheckoutModal';
import AdminCRM from './components/AdminCRM';
import SupabaseSetupModal from './components/SupabaseSetupModal';
import Footer from './components/Footer';
import { INITIAL_PRODUCTS, INITIAL_FAQS, DEFAULT_WHATSAPP } from './data/defaultProducts';
import { getSupabaseClient, getSupabaseConfig } from './lib/supabaseClient';
import { MessageCircle, ShieldCheck, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Products State (Loaded from localStorage or default initial products)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ardistore_products_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse local products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // FAQs State (Loaded from localStorage or default initial FAQs)
  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('ardistore_faqs_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse local faqs', e);
      }
    }
    return INITIAL_FAQS;
  });

  // UI States
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Sync Supabase status and fetch cloud products & FAQs if available
  const syncWithSupabase = async () => {
    const config = getSupabaseConfig();
    const supabase = getSupabaseClient();

    if (config && supabase) {
      setIsSupabaseConnected(true);
      
      // 1. Sync Products
      try {
        const { data: prodData, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!prodErr && prodData && prodData.length > 0) {
          const formattedProds = prodData.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: Number(item.price),
            unit: item.unit || '',
            badge: item.badge || '',
            image: item.image,
            description: item.description,
            features: Array.isArray(item.features) ? item.features : [],
            isActive: item.is_active !== false,
          }));
          setProducts(formattedProds);
          localStorage.setItem('ardistore_products_data', JSON.stringify(formattedProds));
        } else if (!prodErr && prodData && prodData.length === 0) {
          for (const p of INITIAL_PRODUCTS) {
            await supabase.from('products').upsert({
              id: p.id,
              name: p.name,
              category: p.category,
              price: p.price,
              unit: p.unit,
              badge: p.badge,
              image: p.image,
              description: p.description,
              features: p.features,
              is_active: p.isActive,
            });
          }
        }
      } catch (err) {
        console.warn('Supabase product fetch error, using local fallback', err);
      }

      // 2. Sync FAQs
      try {
        const { data: faqData, error: faqErr } = await supabase
          .from('faqs')
          .select('*')
          .order('created_at', { ascending: true });

        if (!faqErr && faqData && faqData.length > 0) {
          const formattedFaqs = faqData.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            isActive: item.is_active !== false,
          }));
          setFaqs(formattedFaqs);
          localStorage.setItem('ardistore_faqs_data', JSON.stringify(formattedFaqs));
        } else if (!faqErr && faqData && faqData.length === 0) {
          for (const f of INITIAL_FAQS) {
            await supabase.from('faqs').upsert({
              id: f.id,
              question: f.question,
              answer: f.answer,
              is_active: f.isActive,
            });
          }
        }
      } catch (err) {
        console.warn('Supabase faqs fetch error, using local fallback', err);
      }

    } else {
      setIsSupabaseConnected(false);
    }
  };

  useEffect(() => {
    syncWithSupabase();
  }, []);

  // --- PRODUCT HANDLERS ---
  const handleSaveProduct = async (productData) => {
    let updated;
    const exists = products.find((p) => p.id === productData.id);

    if (exists) {
      updated = products.map((p) => (p.id === productData.id ? productData : p));
    } else {
      updated = [productData, ...products];
    }

    setProducts(updated);
    localStorage.setItem('ardistore_products_data', JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('products').upsert({
          id: productData.id,
          name: productData.name,
          category: productData.category,
          price: productData.price,
          unit: productData.unit,
          badge: productData.badge,
          image: productData.image,
          description: productData.description,
          features: productData.features,
          is_active: productData.isActive,
        });
      } catch (e) {
        console.error('Error syncing product to Supabase:', e);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('ardistore_products_data', JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.error('Error deleting product from Supabase:', e);
      }
    }
  };

  const handleResetProducts = () => {
    if (window.confirm('Reset semua data produk ke katalog awal Ardistore Digital?')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('ardistore_products_data', JSON.stringify(INITIAL_PRODUCTS));
    }
  };

  // --- FAQ HANDLERS ---
  const handleSaveFaq = async (faqData) => {
    let updated;
    const exists = faqs.find((f) => f.id === faqData.id);

    if (exists) {
      updated = faqs.map((f) => (f.id === faqData.id ? faqData : f));
    } else {
      updated = [...faqs, faqData];
    }

    setFaqs(updated);
    localStorage.setItem('ardistore_faqs_data', JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('faqs').upsert({
          id: faqData.id,
          question: faqData.question,
          answer: faqData.answer,
          is_active: faqData.isActive,
        });
      } catch (e) {
        console.error('Error syncing FAQ to Supabase:', e);
      }
    }
  };

  const handleDeleteFaq = async (id) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    localStorage.setItem('ardistore_faqs_data', JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('faqs').delete().eq('id', id);
      } catch (e) {
        console.error('Error deleting FAQ from Supabase:', e);
      }
    }
  };

  const handleResetFaqs = () => {
    if (window.confirm('Reset daftar FAQ ke pertanyaan standar?')) {
      setFaqs(INITIAL_FAQS);
      localStorage.setItem('ardistore_faqs_data', JSON.stringify(INITIAL_FAQS));
    }
  };

  // Category counts
  const categoryCounts = {
    all: products.filter((p) => p.isActive !== false).length,
    mlbb: products.filter((p) => p.category === 'mlbb' && p.isActive !== false).length,
    'premium-app': products.filter((p) => p.category === 'premium-app' && p.isActive !== false).length,
    sosmed: products.filter((p) => p.category === 'sosmed' && p.isActive !== false).length,
  };

  const activeFaqs = faqs.filter((f) => f.isActive !== false);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        productsCount={products.length}
      />

      <main className="flex-1">
        {/* 2. Hero Section with Search & Trust Badges */}
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 3. Category Filter Tabs */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={categoryCounts}
        />

        {/* 4. Products Section (Clean, Categorized & View Mode Toggled) */}
        <ProductsSection
          products={products.filter((p) => {
            if (p.isActive === false) return false;
            if (!searchQuery) return true;
            return (
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (p.features && p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())))
            );
          })}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onResetSearch={() => {
            setSearchQuery('');
            setActiveCategory('all');
          }}
          onSelectForCheckout={(prod) => setSelectedProduct(prod)}
        />

        {/* 5. Cara Pemesanan / How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800/80">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/50">
                Alur Mudah &amp; Cepat
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                Cara Order di Ardistore Digital
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Hanya butuh 3 langkah praktis tanpa ribet registrasi akun.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black text-lg mx-auto mb-4">
                  1
                </div>
                <h4 className="text-base font-bold text-white mb-2">Pilih Layanan</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pilih produk Tutor MLBB, Script GG, Aplikasi Premium, atau Layanan Sosmed sesuai kebutuhan Anda.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-lg mx-auto mb-4">
                  2
                </div>
                <h4 className="text-base font-bold text-white mb-2">Kirim ke WhatsApp</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Klik tombol <strong>"Pesan via WA"</strong>. Format pesan sudah otomatis terisi dan siap dikirim langsung ke Customer Service resmi kami.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-lg mx-auto mb-4">
                  3
                </div>
                <h4 className="text-base font-bold text-white mb-2">Bayar &amp; Proses</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lakukan pembayaran melalui QRIS/Transfer Bank. Pesanan Anda langsung diproses dan dikirim dalam hitungan menit!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section (Dynamic & Managed from CRM) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pusat Bantuan &amp; FAQ</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Pertanyaan Sering Diajukan (FAQ)</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Jawaban cepat seputar layanan kami</p>
          </div>

          <div className="space-y-3">
            {activeFaqs.length === 0 ? (
              <div className="text-center py-8 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Belum ada pertanyaan FAQ yang diterbitkan.
              </div>
            ) : (
              activeFaqs.map((faq, i) => (
                <details key={faq.id || i} className="group glass-card rounded-2xl border border-slate-800 p-4 sm:p-5 open:border-purple-500/40 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer font-bold text-xs sm:text-sm text-white list-none select-none">
                    <span className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-2" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed pt-3 border-t border-slate-800/60 pl-7">
                    {faq.answer}
                  </p>
                </details>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Floating Action WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${DEFAULT_WHATSAPP}?text=Halo%20Admin%20Ardistore%20Digital,%20saya%20mau%20konsultasi%20layanan.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-glow-neon hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Hubungi WhatsApp Kami</span>
        </a>
      </div>

      {/* Modals */}
      <CheckoutModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <AdminCRM
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        faqs={faqs}
        onSaveFaq={handleSaveFaq}
        onDeleteFaq={handleDeleteFaq}
        onResetFaqs={handleResetFaqs}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
      />

      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={syncWithSupabase}
      />

      {/* 7. Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        onSelectCategory={setActiveCategory}
      />

    </div>
  );
}
