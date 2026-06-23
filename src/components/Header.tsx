import React from 'react';
import { Sparkles, Video, Zap, Share2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex flex-wrap gap-4 items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-md shadow-emerald-500/20">
          <Video className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-xl tracking-tight text-white">
              Clipper AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Studio</span>
            </h1>
            <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
              v2.0 PRO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            O melhor gerador de clipes virais estilo Opus Clip – 100% Grátis & Ilimitado
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Real-time status tracker */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>IA Ativa: <strong className="text-emerald-400">Gemini 3.5 Flash</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-xs font-medium text-emerald-300">
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Créditos: <strong className="text-white">ILIMITADOS</strong></span>
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('demo-hub');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all"
        >
          Ver Templates
        </button>
      </div>
    </header>
  );
}
