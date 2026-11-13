import React from 'react';
import { Sparkles, Gamepad2, Crown, Share2 } from 'lucide-react';
import { CATEGORIES } from '../data/defaultProducts';

const ICONS = {
  Sparkles,
  Gamepad2,
  Crown,
  Share2
};

export default function CategoryNav({ activeCategory, onSelectCategory, counts }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-3 sm:pb-0 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                // Smooth scroll to the target category or products section
                setTimeout(() => {
                  const targetId = cat.id === 'all' ? 'products-section' : cat.id;
                  const targetEl = document.getElementById(targetId) || document.getElementById('products-section');
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 50);
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
