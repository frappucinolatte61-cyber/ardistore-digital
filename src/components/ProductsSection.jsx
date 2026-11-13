import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { 
  Gamepad2, Crown, Share2, Sparkles, LayoutGrid, List, 
  ChevronDown, ChevronUp, ArrowRight, MessageCircle 
} from 'lucide-react';
import { CATEGORIES, DEFAULT_WHATSAPP } from '../data/defaultProducts';

const CATEGORY_META = {
  mlbb: {
    title: 'Kebutuhan Mobile Legends',
    subtitle: 'Tutor Push Rank Vs Bot, Akun Warlit, Script GG & App GM',
    icon: Gamepad2,
    gradient: 'from-cyan-500/20 via-cyan-900/10 to-transparent',
    border: 'border-cyan-500/30',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    accentText: 'text-cyan-400',
  },
  'premium-app': {
    title: 'Kebutuhan Aplikasi Premium',
    subtitle: 'Netflix 4K, Canva Pro, Spotify, YouTube & CapCut VIP Bebas Iklan',
    icon: Crown,
    gradient: 'from-purple-500/20 via-purple-900/10 to-transparent',
    border: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    accentText: 'text-purple-400',
  },
  sosmed: {
    title: 'Kebutuhan Sosial Media',
    subtitle: 'Followers & Likes Instagram, TikTok Syarat Live, Threads & Marketplace',
    icon: Share2,
    gradient: 'from-pink-500/20 via-pink-900/10 to-transparent',
    border: 'border-pink-500/30',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    accentText: 'text-pink-400',
  },
};

export default function ProductsSection({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onResetSearch,
  onSelectForCheckout,
}) {
  // View mode: 'grid' (Kartu visual) | 'table' (Tabel ringkas)
  const [viewMode, setViewMode] = useState('grid');

  // Track expanded state for categories when activeCategory === 'all'
  // By default, show limited items (e.g. 4 items) for each category to keep it neat
  const [expandedCategories, setExpandedCategories] = useState({
    mlbb: false,
    'premium-app': false,
    sosmed: false,
  });

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getDirectWhatsAppUrl = (prod) => {
    const text = encodeURIComponent(
      `Halo Admin Ardistore Digital, saya mau pesan:\n\n` +
      `📦 Produk: *${prod.name}*\n` +
      `🏷️ Kategori: ${prod.category.toUpperCase()}\n` +
      `💰 Harga: *${formatRupiah(prod.price)} ${prod.unit || ''}*\n\n` +
      `Mohon info cara pembayaran dan langkah selanjutnya ya. Terima kasih!`
    );
    return `https://wa.me/${DEFAULT_WHATSAPP}?text=${text}`;
  };

  // Group products by category
  const mlbbProducts = products.filter((p) => p.category === 'mlbb');
  const premiumProducts = products.filter((p) => p.category === 'premium-app');
  const sosmedProducts = products.filter((p) => p.category === 'sosmed');

  const categoryGroups = [
    { id: 'mlbb', items: mlbbProducts, ...CATEGORY_META['mlbb'] },
    { id: 'premium-app', items: premiumProducts, ...CATEGORY_META['premium-app'] },
    { id: 'sosmed', items: sosmedProducts, ...CATEGORY_META['sosmed'] },
  ].filter((group) => {
    if (activeCategory !== 'all') return group.id === activeCategory;
    return true;
  });

  // Calculate total visible products
  const totalVisible = categoryGroups.reduce((acc, curr) => acc + curr.items.length, 0);

  return (
    <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Section Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Daftar Layanan &amp; Pricelist
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              {totalVisible} Layanan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {activeCategory === 'all'
              ? 'Tersusun rapi per-kategori. Klik "Lihat Semua" untuk membuka seluruh paket.'
              : `Menampilkan layanan khusus kategori ${CATEGORY_META[activeCategory]?.title || ''}`}
          </p>
        </div>

        {/* View Mode Toggle: Grid Cards vs Compact Table */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kartu Bergambar"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tabel Daftar Harga Cepat"
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabel Ringkas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalVisible === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 max-w-lg mx-auto">
          <p className="text-slate-400 text-sm mb-3">Tidak ada layanan yang sesuai dengan filter saat ini.</p>
          <button
            onClick={onResetSearch}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
          >
            Reset Filter &amp; Tampilkan Semua
          </button>
        </div>
      ) : (
        /* RENDER CATEGORY GROUPS NEATLY */
        <div className="space-y-12">
          {categoryGroups.map((group) => {
            const Icon = group.icon;
            const isSingleCategoryView = activeCategory !== 'all';
            const isExpanded = expandedCategories[group.id] || isSingleCategoryView || searchQuery.length > 0;
            
            // Limit to 4 cards if collapsed in 'all' view; otherwise show all
            const displayedItems = isExpanded ? group.items : group.items.slice(0, 4);
            const remainingCount = group.items.length - 4;

            return (
              <div
                key={group.id}
                id={group.id}
                className="rounded-3xl glass-card border border-slate-800/80 p-5 sm:p-7 relative overflow-hidden transition-all duration-300 scroll-mt-28"
              >
                {/* Subtle top banner glow per category */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${group.gradient}`} />

                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/60">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-slate-900 border ${group.border} flex items-center justify-center ${group.accentText}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {group.title}
                        </h3>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${group.badgeColor}`}>
                          {group.items.length} Paket
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {group.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Category Action Link */}
                  {activeCategory === 'all' && (
                    <button
                      onClick={() => onSelectCategory(group.id)}
                      className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1 self-start sm:self-auto group transition-colors"
                    >
                      <span>Fokus Kategori Ini</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>

                {/* CONTENT: GRID CARDS VIEW */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {displayedItems.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectForCheckout={onSelectForCheckout}
                      />
                    ))}
                  </div>
                )}

                {/* CONTENT: COMPACT PRICELIST TABLE VIEW */}
                {viewMode === 'table' && (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Layanan</th>
                          <th className="p-3.5 hidden md:table-cell">Keterangan / Fitur Utama</th>
                          <th className="p-3.5">Harga</th>
                          <th className="p-3.5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {displayedItems.map((prod) => (
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
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-white text-xs sm:text-sm">{prod.name}</span>
                                    {prod.badge && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                        {prod.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 md:hidden mt-0.5 line-clamp-1">
                                    {prod.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 hidden md:table-cell">
                              <p className="text-slate-300 text-xs line-clamp-1">{prod.description}</p>
                              {prod.features && prod.features.length > 0 && (
                                <p className="text-[11px] text-cyan-400/80 mt-0.5 font-medium">
                                  ✓ {prod.features[0]}
                                </p>
                              )}
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="text-sm sm:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                {formatRupiah(prod.price)}
                              </span>
                              {prod.unit && (
                                <span className="text-[10px] text-slate-400 font-normal ml-1">
                                  {prod.unit}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => onSelectForCheckout(prod)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors"
                                >
                                  Detail
                                </button>
                                <a
                                  href={getDirectWhatsAppUrl(prod)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-glow-neon flex items-center space-x-1 transition-all"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Order WA</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* "Lihat Semua / Sembunyikan" Button for Category when in 'all' view */}
                {!isSingleCategoryView && remainingCount > 0 && searchQuery.length === 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
                    <button
                      onClick={() => toggleCategoryExpand(group.id)}
                      className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-slate-200 transition-all hover:text-cyan-400"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 text-cyan-400" />
                          <span>Tampilkan Lebih Sedikit (Sembunyikan {remainingCount} Layanan)</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-cyan-400" />
                          <span>Lihat Selengkapnya (+{remainingCount} Layanan {group.title})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
