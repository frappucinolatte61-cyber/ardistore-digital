import React, { useState } from 'react';
import { 
  X, MessageCircle, Check, ShieldCheck, Play, Image as ImageIcon, 
  Sparkles, ExternalLink, Video
} from 'lucide-react';
import { DEFAULT_WHATSAPP } from '../data/defaultProducts';

// Utility helper to detect and parse various video URLs (YouTube, MP4, Google Drive, etc.)
const parseVideoEmbed = (url) => {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // YouTube format (standard watch?v=, youtu.be, shorts/, embed/)
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      videoId: ytMatch[1],
    };
  }

  // Direct MP4 / WebM video files
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(cleanUrl)) {
    return {
      type: 'direct',
      videoUrl: cleanUrl,
    };
  }

  // Google Drive video preview
  if (cleanUrl.includes('drive.google.com/file/d/')) {
    const driveMatch = cleanUrl.match(/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return {
        type: 'iframe',
        embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      };
    }
  }

  // Generic fallback if user already pasted an embed link
  if (cleanUrl.includes('/embed/')) {
    return {
      type: 'iframe',
      embedUrl: cleanUrl,
    };
  }

  return null;
};

export default function CheckoutModal({ product, onClose }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Collect all available media (Main Image, Video, and Gallery)
  const videoData = parseVideoEmbed(product.videoUrl || product.video_url);
  const galleryList = Array.isArray(product.gallery) 
    ? product.gallery 
    : (product.gallery ? [product.gallery] : []);

  const mediaItems = [];

  // If video exists, put it first so buyers see interactive demo immediately
  if (videoData) {
    mediaItems.push({
      id: 'video',
      type: 'video',
      label: 'Video Demo',
      ...videoData,
    });
  }

  // Main Image
  if (product.image) {
    mediaItems.push({
      id: 'img-main',
      type: 'image',
      label: 'Foto Utama',
      url: product.image,
    });
  }

  // Additional Gallery Images
  galleryList.forEach((imgUrl, index) => {
    if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim()) {
      mediaItems.push({
        id: `img-gallery-${index}`,
        type: 'image',
        label: `Foto ${index + 2}`,
        url: imgUrl.trim(),
      });
    }
  });

  // Active Media selection
  const [activeMediaId, setActiveMediaId] = useState(() => {
    return mediaItems.length > 0 ? mediaItems[0].id : null;
  });

  const activeMedia = mediaItems.find((m) => m.id === activeMediaId) || mediaItems[0];

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const totalPrice = product.price * quantity;

  const handleSendOrder = () => {
    const text = encodeURIComponent(
      `*FORM PEMESANAN ARDISTORE DIGITAL*\n` +
      `----------------------------------------\n` +
      `📦 *Produk:* ${product.name}\n` +
      `🏷️ *Kategori:* ${product.category.toUpperCase()}\n` +
      `🔢 *Jumlah:* ${quantity} ${product.unit || 'paket'}\n` +
      `💰 *Total Pembayaran:* ${formatRupiah(totalPrice)}\n` +
      `👤 *Nama Pembeli:* ${customerName || '-'}\n` +
      `📝 *Catatan/Akun:* ${customerNotes || '-'}\n` +
      `----------------------------------------\n` +
      `Halo Admin, saya ingin melanjutkan pesanan ini. Mohon info nomor rekening / QRIS untuk pembayaran. Terima kasih!`
    );

    window.open(`https://wa.me/${DEFAULT_WHATSAPP}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 transition-colors shadow-lg"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* 1. MEDIA SHOWCASE (VIDEO & IMAGE GALLERY) */}
          {mediaItems.length > 0 && (
            <div className="space-y-3">
              {/* Media Player Box */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
                
                {/* A. If Active is Video */}
                {activeMedia && activeMedia.type === 'video' ? (
                  activeMedia.type === 'video' && activeMedia.embedUrl ? (
                    <iframe
                      src={activeMedia.embedUrl}
                      title={`Video Demo ${product.name}`}
                      className="w-full h-full rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain rounded-2xl bg-black"
                    >
                      <source src={activeMedia.videoUrl} type="video/mp4" />
                      Browser Anda tidak mendukung pemutar video HTML5.
                    </video>
                  )
                ) : (
                  /* B. If Active is Image */
                  <div className="relative w-full h-full">
                    <img
                      src={activeMedia ? activeMedia.url : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Floating Badges on top of Media */}
                <div className="absolute top-3 left-3 flex items-center space-x-2 pointer-events-none">
                  {product.badge && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500 text-black shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      <span>{product.badge}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row (Visible if more than 1 media item) */}
              {mediaItems.length > 1 && (
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                  {mediaItems.map((media) => {
                    const isActive = media.id === activeMediaId;
                    return (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => setActiveMediaId(media.id)}
                        className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all group ${
                          isActive 
                            ? 'border-cyan-400 shadow-glow-cyan scale-105' 
                            : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }`}
                        title={media.label}
                      >
                        {media.type === 'video' ? (
                          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                            {media.thumbnailUrl ? (
                              <img src={media.thumbnailUrl} alt="Thumbnail Video" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-rose-950/80 flex items-center justify-center">
                                <Video className="w-5 h-5 text-rose-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                                <Play className="w-3 h-3 fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={media.url}
                            alt={media.label}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white text-center py-0.5 font-medium truncate">
                          {media.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. PRODUCT TITLE & PRICING */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kategori: <span className="text-cyan-400 font-semibold uppercase">{product.category}</span>
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-slate-400 block">Harga Spesial:</span>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {formatRupiah(product.price)}
                {product.unit && (
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    {product.unit}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* 3. PRODUCT DESCRIPTION */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Deskripsi Layanan
            </h4>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {product.description}
            </div>
          </div>

          {/* 4. PRODUCT FEATURES & BENEFITS */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Keunggulan &amp; Fitur Paket
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-cyan-400" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ORDER FORM CONFIGURATION */}
          <div className="space-y-3.5 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Formulir Pemesanan Cepat
            </h4>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-bold text-white block">
                  Jumlah Pesanan:
                </label>
                <span className="text-[11px] text-slate-400">
                  Satuan: {product.unit || 'paket'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700 active:scale-95 border border-slate-700 transition-all"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center py-1 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700 active:scale-95 border border-slate-700 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Pemesan (Opsional):
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Rian / Ardi"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            {/* Customer Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catatan / Data Target (Opsional):
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Misal: Username IG, Device Netflix, atau request khusus..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 resize-none font-medium"
              />
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800/90 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 font-medium block">Total Estimasi Biaya:</span>
                <span className="text-[11px] text-slate-400">({quantity} x {formatRupiah(product.price)})</span>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 justify-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Metode Bayar: QRIS All Payment, BCA, Mandiri, DANA, GoPay, OVO</span>
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 bg-slate-950/95 border-t border-slate-800 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handleSendOrder}
            className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-glow-neon flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Pesanan ke WA</span>
          </button>
        </div>

      </div>
    </div>
  );
}
