import React from 'react';
import { MessageCircle, ShieldCheck, Heart, Lock, Database } from 'lucide-react';
import { DEFAULT_WHATSAPP } from '../data/defaultProducts';

export default function Footer({ onOpenAdmin, onOpenSupabaseConfig, isSupabaseConnected }) {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#06080e] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                  <span className="text-lg font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AD</span>
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Ardistore <span className="text-cyan-400">Digital</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform layanan digital terpercaya spesialis Mobile Legends (Tutor Rank Vs Bot, Script GG, Warlit), Akun Aplikasi Premium resmi, dan Jasa Optimasi Sosial Media.
            </p>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transaksi Aman Langsung ke WhatsApp Resmi: <strong className="text-slate-200">08980503699</strong></span>
            </div>
          </div>

          {/* Kategori Populer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kategori Layanan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#mlbb" className="hover:text-cyan-400 transition-colors">Tutor Rank Vs Bot MLBB</a></li>
              <li><a href="#mlbb" className="hover:text-cyan-400 transition-colors">Script Game Guardian Season</a></li>
              <li><a href="#premium-app" className="hover:text-cyan-400 transition-colors">Netflix &amp; Canva Premium</a></li>
              <li><a href="#premium-app" className="hover:text-cyan-400 transition-colors">Spotify &amp; YouTube Premium</a></li>
              <li><a href="#sosmed" className="hover:text-cyan-400 transition-colors">Followers &amp; Views Sosmed</a></li>
            </ul>
          </div>

          {/* Pembayaran & Keamanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Metode Pembayaran</h4>
            <p className="text-xs text-slate-400">Menerima semua transaksi digital otomatis &amp; manual:</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['QRIS (Semua E-Wallet)', 'BCA', 'Mandiri', 'DANA', 'GoPay', 'OVO', 'ShopeePay'].map((pay, i) => (
                <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[10px] text-slate-300 font-medium">
                  {pay}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${DEFAULT_WHATSAPP}?text=Halo%20Admin%20Ardistore,%20saya%20butuh%20bantuan.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Admin WhatsApp (08980503699)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar & CRM Trigger */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Ardistore Digital. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenSupabaseConfig}
              className="hover:text-emerald-400 transition-colors flex items-center space-x-1 text-[11px]"
            >
              <Database className="w-3 h-3 text-emerald-500" />
              <span>{isSupabaseConnected ? 'Database: Supabase Aktif' : 'Database: Offline'}</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="hover:text-cyan-400 transition-colors flex items-center space-x-1 text-[11px]"
            >
              <Lock className="w-3 h-3 text-cyan-500" />
              <span>Portal CRM Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
