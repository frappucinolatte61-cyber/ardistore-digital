import React from 'react';
import { ShieldCheck, MessageCircle, Lock, Sparkles, Terminal } from 'lucide-react';
import { DEFAULT_WHATSAPP } from '../data/defaultProducts';

export default function Header({ onOpenAdmin }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AD</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                Ardistore <span className="text-cyan-400 font-extrabold">Digital</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Online 24/7
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Pusat Layanan Game, Premium Apps & Sosmed</p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick link to WhatsApp */}
          <a
            href={`https://wa.me/${DEFAULT_WHATSAPP}?text=Halo%20Admin%20Ardistore%20Digital,%20saya%20mau%20tanya%20layanan%20Anda.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm shadow-glow-neon transition-all transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp CS</span>
            <span className="sm:hidden">CS</span>
          </a>

          {/* Discreet Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 text-xs sm:text-sm font-medium transition-all"
            title="Buka CRM Admin"
          >
            <Lock className="w-4 h-4 text-cyan-500" />
            <span className="hidden sm:inline">Portal Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
}
