import React from 'react';
import { ShieldCheck, Zap, Award, Clock, ArrowDown, Search } from 'lucide-react';

export default function Hero({ searchQuery, setSearchQuery, onScrollToProducts }) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-600/20 to-blue-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[350px] h-[250px] bg-purple-600/15 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tagline */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-semibold mb-6 animate-pulse">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Pusat Layanan Digital #1 di Indonesia</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Layanan <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Mobile Legends</span>, Aplikasi Premium &amp; Sosmed
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tutor Push Rank Vs Bot MLBB, Script GG Full Fitur, Netflix &amp; Canva Premium, hingga Jasa Followers Sosial Media. Cepat, Murah, dan Bergaransi!
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan... (misal: 'Bot', 'Netflix', 'Script', 'Followers')"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm sm:text-base shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Trust Value Propositions */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-3 sm:p-4 rounded-xl flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Proses Instan</p>
              <p className="text-[11px] text-slate-400">Proses 5-15 Menit</p>
            </div>
          </div>

          <div className="glass-card p-3 sm:p-4 rounded-xl flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">100% Bergaransi</p>
              <p className="text-[11px] text-slate-400">Jaminan uang kembali</p>
            </div>
          </div>

          <div className="glass-card p-3 sm:p-4 rounded-xl flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Harga Terbaik</p>
              <p className="text-[11px] text-slate-400">Mulai Rp 3.000-an</p>
            </div>
          </div>

          <div className="glass-card p-3 sm:p-4 rounded-xl flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">CS Fast Respond</p>
              <p className="text-[11px] text-slate-400">Siap bantu 24/7</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
