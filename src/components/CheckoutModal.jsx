import React, { useState } from 'react';
import { X, MessageCircle, Check, ShieldCheck, QrCode } from 'lucide-react';
import { DEFAULT_WHATSAPP } from '../data/defaultProducts';

export default function CheckoutModal({ product, onClose }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
                {product.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                {product.name}
              </h3>
              <p className="text-emerald-400 font-extrabold text-lg">
                {formatRupiah(product.price)} <span className="text-xs text-slate-400 font-normal">{product.unit}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* Deskripsi */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi</h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {product.description}
            </p>
          </div>

          {/* Fitur Utama */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Benefit &amp; Fitur</h4>
              <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Configuration */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* Jumlah / Qty */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Jumlah / Quantity:
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700 active:scale-95 border border-slate-700"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700 active:scale-95 border border-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nama Pembeli */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Anda (Opsional):
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Rian / Ardi"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Catatan / Kebutuhan Khusus */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catatan / Data Target (Opsional):
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Misal: Username IG, Device Netflix, atau request khusus..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Total Pembayaran:</span>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Metode Bayar: QRIS All Payment, BCA, DANA, GoPay, OVO</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Batal
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
