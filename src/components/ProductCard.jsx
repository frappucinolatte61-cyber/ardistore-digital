import React from 'react';
import { MessageCircle, Check, Sparkles, Tag } from 'lucide-react';
import { DEFAULT_WHATSAPP } from '../data/defaultProducts';

export default function ProductCard({ product, onSelectForCheckout }) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const getDirectWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Halo Admin Ardistore Digital, saya mau pesan:\n\n` +
      `📦 Produk: *${product.name}*\n` +
      `🏷️ Kategori: ${product.category.toUpperCase()}\n` +
      `💰 Harga: *${formatRupiah(product.price)} ${product.unit || ''}*\n\n` +
      `Mohon info cara pembayaran dan langkah selanjutnya ya. Terima kasih!`
    );
    return `https://wa.me/${DEFAULT_WHATSAPP}?text=${text}`;
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'mlbb':
        return 'text-cyan-400 bg-cyan-950/50 border-cyan-800/60';
      case 'premium-app':
        return 'text-purple-400 bg-purple-950/50 border-purple-800/60';
      case 'sosmed':
        return 'text-pink-400 bg-pink-950/50 border-pink-800/60';
      default:
        return 'text-blue-400 bg-blue-950/50 border-blue-800/60';
    }
  };

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent opacity-80" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500 text-black shadow-lg">
                <Sparkles className="w-3 h-3" />
                <span>{product.badge}</span>
              </span>
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryColor(product.category)}`}>
              {product.category === 'mlbb' ? 'MLBB' : product.category === 'premium-app' ? 'App Pro' : 'Sosmed'}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Price Tag */}
          <div className="mt-3 flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {formatRupiah(product.price)}
            </span>
            {product.unit && (
              <span className="text-xs font-medium text-slate-400">
                {product.unit}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Features bullets */}
          {product.features && product.features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
              {product.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                  <span className="line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 grid grid-cols-5 gap-2">
        <button
          onClick={() => onSelectForCheckout(product)}
          className="col-span-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all text-center"
        >
          Detail / Opsi
        </button>

        <a
          href={getDirectWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-3 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-glow-neon flex items-center justify-center space-x-1.5 transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Pesan via WA</span>
        </a>
      </div>
    </div>
  );
}
