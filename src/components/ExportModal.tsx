import React, { useEffect, useState } from 'react';
import { SubtitleWord, VideoClip } from '../types';
import { CheckCircle, Download, FileText, Share2, Sparkles, X, Youtube } from 'lucide-react';

interface ExportModalProps {
  clip: VideoClip;
  editedWords: SubtitleWord[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ clip, editedWords, isOpen, onClose }: ExportModalProps) {
  const [progress, setProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState('Iniciando compressão de vídeo...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    // Progression simulation of burning subtitles & emojis
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 12) + 5;
        const bounded = Math.min(100, next);

        // Dynamic, reassuring rendering messages
        if (bounded < 25) {
          setRenderStatus('Recortando vídeo para o formato 9:16 vertical...');
        } else if (bounded < 50) {
          setRenderStatus('Sincronizando trilha sonora e sobreposição de áudio...');
        } else if (bounded < 75) {
          setRenderStatus('Gravando as legendas estilizadas no vídeo (Burn-in captions)...');
        } else if (bounded < 95) {
          setRenderStatus('Gerando arquivos adicionais e indexando metadados de viralização...');
        } else {
          setRenderStatus('Otimização final concluída!');
        }

        return bounded;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Programmatically generate a fully valid SRT SubRip subtitle file on-the-fly!
  const downloadSRTFile = () => {
    if (editedWords.length === 0) return;

    let srtText = '';
    const groupSize = 4; // group words in blocks of 4 for clean timing lines
    let index = 1;

    for (let i = 0; i < editedWords.length; i += groupSize) {
      const group = editedWords.slice(i, i + groupSize);
      const startSec = group[0].start;
      const endSec = group[group.length - 1].end;

      const formatTime = (sec: number) => {
        const hrs = Math.floor(sec / 3600);
        const mins = Math.floor((sec % 3600) / 60);
        const secs = Math.floor(sec % 60);
        const ms = Math.floor((sec % 1) * 1000);

        const pad = (num: number, size: number) => {
          let s = num.toString();
          while (s.length < size) s = "0" + s;
          return s;
        };

        return `${pad(hrs, 2)}:${pad(mins, 2)}:${pad(secs, 2)},${pad(ms, 3)}`;
      };

      const phrase = group.map((w) => w.text).join(' ');

      srtText += `${index}\n`;
      srtText += `${formatTime(startSec)} --> ${formatTime(endSec)}\n`;
      srtText += `${phrase}\n\n`;
      index++;
    }

    const blob = new Blob([srtText], { type: 'text/srt;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${clip.title.replace(/\s+/g, '_')}_legendas.srt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock download compiled video file
  const downloadMockVideo = () => {
    alert("Exportação gratuita concluída! Seu vídeo com legendas integradas está pronto. (No ambiente do AI Studio Sandbox, o download do MP4 final foi simulado. Mas as suas legendas editadas SRT foram salvas!)");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950/40 text-slate-400 hover:text-white hover:bg-slate-950/80 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {progress < 100 ? (
          // RENDERING PHASE
          <div className="flex flex-col items-center text-center py-6">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-emerald-500/10 border-t-emerald-400 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-extrabold text-lg text-emerald-400">
                  {progress}%
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white font-display mb-1">
              Estilizando seu clipe viral...
            </h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
              {renderStatus}
            </p>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          // COMPLETED SUCCESS PHASE
          <div className="flex flex-col items-center text-center py-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 fill-emerald-500/10" />
            </div>

            <h3 className="text-lg font-display font-bold text-white">
              Clipe Pronto! 🚀
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              O render foi concluído com sucesso e o arquivo foi empacotado para redes sociais de forma 100% grátis.
            </p>

            {/* Downloads block */}
            <div className="w-full space-y-2.5 mt-6 mb-5">
              {/* Programmatic SRT Download (Real functionality!) */}
              <button
                type="button"
                onClick={downloadSRTFile}
                className="w-full bg-slate-950 hover:bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Baixar Arquivo de Legenda (.SRT)</span>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              {/* simulated Video Download */}
              <button
                type="button"
                onClick={downloadMockVideo}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold py-3 px-4 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 fill-slate-950/10" />
                  <span>Exportar Vídeo Final (.MP4)</span>
                </div>
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full border-t border-slate-800 pt-4 text-[10px] text-slate-500 flex justify-between items-center">
              <span>Nenhum logo ou marca d&apos;água adicionada</span>
              <span className="font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25">
                GRÁTIS
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
