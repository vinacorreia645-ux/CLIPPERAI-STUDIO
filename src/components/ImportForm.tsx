import React, { useState } from 'react';
import { Link, Sparkles, Youtube, AlignLeft, Info, HelpCircle } from 'lucide-react';
import { DEMO_VIDEOS } from '../data/defaultClips';

interface ImportFormProps {
  onLoadDemo: (videoId: string) => void;
  onSubmitCustom: (payload: { videoUrl: string; topic: string; transcript: string }) => Promise<void>;
  isLoading: boolean;
  statusText: string;
}

export default function ImportForm({ onLoadDemo, onSubmitCustom, isLoading, statusText }: ImportFormProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [transcript, setTranscript] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'topic'>('url');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl && !topic && !transcript) return;
    onSubmitCustom({ videoUrl, topic, transcript });
  };

  return (
    <div id="demo-hub" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
            Passo 1: Selecione ou Importe um Vídeo Longo
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Escolha um dos nossos modelos profissionais prontos abaixo ou insira o seu próprio tema/link para o Gemini analisar e clipar.
          </p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === 'url' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Importar Link ou Texto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('topic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === 'topic' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Gerar por Tema (Ideia)
          </button>
        </div>
      </div>

      {/* Grid of professional preset templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {DEMO_VIDEOS.map((video) => (
          <div
            key={video.id}
            onClick={() => !isLoading && onLoadDemo(video.id)}
            className="group relative overflow-hidden bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {video.category}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Duração: {video.duration}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="font-display font-bold text-slate-200 group-hover:text-white transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Palestrante: {video.speaker}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
              <span className="text-xs text-emerald-400 font-semibold group-hover:underline flex items-center gap-1.5">
                ⚡️ Testar Clipes de Demonstração
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                Sem tempo de espera
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Input form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-800 pt-6">
        {activeTab === 'url' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" />
                Link do Vídeo (YouTube, Vimeo ou Direct MP4)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-colors"
              />
              <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400" />
                Adicione um link público. A IA fará a análise do roteiro e ganchos.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5" />
                Transcrição Manual / Texto do Vídeo (Opcional)
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Insira o texto falado do vídeo aqui se preferir que a IA analise uma transcrição específica..."
                disabled={isLoading}
                rows={1}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors resize-none h-[46px]"
              />
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Qual é o tema ou nicho do seu canal?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Segredos do Marketing Digital, Finanças para Jovens, Como usar IA..."
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-colors"
            />
            <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              O Gemini vai simular diálogos realistas e ganchos perfeitos baseados nessa ideia de conteúdo!
            </p>
          </div>
        )}

        {/* Action Button & Loading Status feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 max-w-md">
            Pressione o botão para que a nossa IA Gemini divida o conteúdo longo em seções, avalie a retenção de público, e escreva as legendas com emojis animados.
          </div>
          <button
            type="submit"
            disabled={isLoading || (!videoUrl && !topic && !transcript)}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'IA Processando...' : 'Criar Clipes com Gemini AI'}
          </button>
        </div>
      </form>

      {/* Elegant overlay screen during active Gemini loading */}
      {isLoading && (
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4 animate-pulse">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
            <Sparkles className="w-4 h-4 text-emerald-400 absolute top-3.5 left-3.5 animate-bounce" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Análise de Redes Sociais do Gemini em progresso</span>
              <span className="text-[10px] font-mono text-slate-500">Estimado: ~10s</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium mt-1">
              {statusText || "Aguardando o motor da IA..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
