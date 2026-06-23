import React, { useState } from 'react';
import { VideoClip } from '../types';
import { Flame, Copy, Check, MessageSquare, ChevronDown, ChevronUp, Share2, Award, Sparkles } from 'lucide-react';

interface ClipSelectorProps {
  clips: VideoClip[];
  selectedClipId: string;
  onSelectClip: (clipId: string) => void;
}

export default function ClipSelector({ clips, selectedClipId, onSelectClip }: ClipSelectorProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);

  const copyToClipboard = (text: string, clipId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(clipId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExplanation = (clipId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedExplanation(prev => prev === clipId ? null : clipId);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Clipes Encontrados
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organizados por pontuação de viralidade
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
          {clips.length} {clips.length === 1 ? 'Clipe' : 'Clipes'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[500px] lg:max-h-[600px] pr-1">
        {clips.map((clip) => {
          const isSelected = clip.id === selectedClipId;
          const isExpanded = expandedExplanation === clip.id;

          return (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip.id)}
              className={`group border rounded-xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-950 border-emerald-500/80 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`font-display font-bold text-sm leading-snug transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {clip.title}
                  </h3>
                  <div className="flex items-center gap-2.5 mt-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Trecho: {Math.floor(clip.startTime)}s - {Math.floor(clip.endTime)}s
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ({Math.floor(clip.endTime - clip.startTime)}s de duração)
                    </span>
                  </div>
                </div>

                {/* Score badge with custom glow for super high scores */}
                <div className="text-right flex flex-col items-end shrink-0">
                  <div className="relative">
                    <div className={`flex items-center justify-center font-display font-extrabold text-xs px-2.5 py-1 rounded-full ${
                      clip.viralScore >= 95
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                        : clip.viralScore >= 90
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                    }`}>
                      <Flame className="w-3.5 h-3.5 mr-1 fill-current" />
                      <span>{clip.viralScore}</span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 mt-1">
                    Viral Score
                  </span>
                </div>
              </div>

              {/* Explanations drawer */}
              <div className="mt-3 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                <button
                  onClick={(e) => toggleExplanation(clip.id, e)}
                  className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Ocultar Análise Estratégica
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      Ver Análise Estratégica
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(clip.socialDescription, clip.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-slate-900 text-slate-400 hover:text-white transition-all flex items-center gap-1 text-xs"
                    title="Copiar Descrição Social"
                  >
                    {copiedId === clip.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Strategy Box */}
              {isExpanded && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Análise do Copiloto IA:</span>
                  </div>
                  <p>{clip.viralExplanation}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <span className="font-bold text-slate-400 block mb-1">Hashtags recomendadas:</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {clip.hashtags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-950 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <span className="font-bold text-slate-400 block mb-1">Copy Social pronto:</span>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800/50 text-slate-400 font-mono text-[10px] whitespace-pre-wrap">
                      {clip.socialDescription}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
