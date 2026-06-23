import React from 'react';
import { SubtitleStyle, VideoLayout } from '../types';
import { Smartphone, Monitor, Layers, Sparkles, Smile, ShieldAlert } from 'lucide-react';

interface StylePanelProps {
  layout: VideoLayout;
  onLayoutChange: (layout: VideoLayout) => void;
  subtitleStyle: SubtitleStyle;
  onSubtitleStyleChange: (style: SubtitleStyle) => void;
}

export default function StylePanel({
  layout,
  onLayoutChange,
  subtitleStyle,
  onSubtitleStyleChange
}: StylePanelProps) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-5">
      {/* 1. Layout selection */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-400" />
          Configuração de Layout do Vídeo
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onLayoutChange('vertical-crop')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              layout === 'vertical-crop'
                ? 'bg-emerald-500/10 border-emerald-500/80 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Recorte 9:16</span>
          </button>

          <button
            type="button"
            onClick={() => onLayoutChange('split-screen')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              layout === 'split-screen'
                ? 'bg-emerald-500/10 border-emerald-500/80 text-emerald-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Vídeo no topo e gameplay embaixo para máxima retenção!"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Split Screen</span>
          </button>

          <button
            type="button"
            onClick={() => onLayoutChange('widescreen')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              layout === 'widescreen'
                ? 'bg-emerald-500/10 border-emerald-500/80 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Original 16:9</span>
          </button>
        </div>
      </div>

      {/* 2. Subtitle preset selection */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Preset de Legenda IA
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Alex Hormozi style */}
          <button
            type="button"
            onClick={() => onSubtitleStyleChange('hormozi')}
            className={`p-4 rounded-xl border text-left transition-all ${
              subtitleStyle === 'hormozi'
                ? 'bg-emerald-500/10 border-emerald-500/80 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-display uppercase tracking-wider">Hormozi Viral</span>
              <span className="text-[9px] bg-emerald-500 text-slate-950 px-1 py-0.2 rounded font-mono font-bold uppercase">Popular</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
              Caixa alta, palavras inclinadas nas cores amarela e verde com pops de emoji.
            </p>
          </button>

          {/* Retro Bold stroke style */}
          <button
            type="button"
            onClick={() => onSubtitleStyleChange('bold-retro')}
            className={`p-4 rounded-xl border text-left transition-all ${
              subtitleStyle === 'bold-retro'
                ? 'bg-emerald-500/10 border-emerald-500/80 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-bold font-display uppercase tracking-wider">Retro Bold</span>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
              Texto pesado com borda preta grossa 3D, estilo cartoon moderno.
            </p>
          </button>

          {/* Neon Cyber style */}
          <button
            type="button"
            onClick={() => onSubtitleStyleChange('neon')}
            className={`p-4 rounded-xl border text-left transition-all ${
              subtitleStyle === 'neon'
                ? 'bg-emerald-500/10 border-emerald-500/80 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-bold font-display uppercase tracking-wider">Neon Glow</span>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
              Fonte mono, bordas brilhantes em ciano com palavras ativas em rosa néon.
            </p>
          </button>

          {/* Clean minimal */}
          <button
            type="button"
            onClick={() => onSubtitleStyleChange('minimal')}
            className={`p-4 rounded-xl border text-left transition-all ${
              subtitleStyle === 'minimal'
                ? 'bg-emerald-500/10 border-emerald-500/80 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-bold font-display uppercase tracking-wider">Doc Minimal</span>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
              Fonte limpa sem adornos, com tarja preta suave e fundo limpo.
            </p>
          </button>
        </div>
      </div>

      {/* 3. AI Audio Narrations/Mock feature overlay details */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5">
        <div className="flex gap-2">
          <Smile className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">
              Efeitos Sonoros & Narração (Copiloto)
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              O Clipper AI adiciona ruídos automáticos de transição (&ldquo;woosh&rdquo;, &ldquo;pop&rdquo;, &ldquo;ding&rdquo;) sincronizados com os emojis e destaques visuais gerados pelo Gemini!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
