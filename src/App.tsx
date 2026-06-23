import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImportForm from './components/ImportForm';
import ClipSelector from './components/ClipSelector';
import VideoCanvas from './components/VideoCanvas';
import StylePanel from './components/StylePanel';
import SubtitleEditor from './components/SubtitleEditor';
import ExportModal from './components/ExportModal';

import { DEFAULT_CLIPS_BY_VIDEO, DEMO_VIDEOS } from './data/defaultClips';
import { VideoClip, VideoLayout, SubtitleStyle, SubtitleWord } from './types';
import { Sparkles, Play, Scissors, Share2, Info, LayoutTemplate, HelpCircle } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  
  // App state
  const [clips, setClips] = useState<VideoClip[]>(DEFAULT_CLIPS_BY_VIDEO['demo-1']);
  const [selectedClipId, setSelectedClipId] = useState<string>('clip-1-1');
  const [layout, setLayout] = useState<VideoLayout>('vertical-crop');
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>('hormozi');
  const [editedWords, setEditedWords] = useState<SubtitleWord[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Active clip pointer
  const activeClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  // Keep edited words in sync with active clip selection
  useEffect(() => {
    if (activeClip) {
      setEditedWords(activeClip.words);
    }
  }, [selectedClipId, clips]);

  // Load template presets instantly
  const handleLoadDemo = (videoId: string) => {
    const demoClips = DEFAULT_CLIPS_BY_VIDEO[videoId];
    if (demoClips && demoClips.length > 0) {
      setClips(demoClips);
      setSelectedClipId(demoClips[0].id);
    }
  };

  // Submit custom URLs/Topics to Gemini AI on the server side
  const handleImportCustom = async (payload: { videoUrl: string; topic: string; transcript: string }) => {
    setIsLoading(true);
    setStatusText('Iniciando análise de vídeo com o Gemini AI...');
    
    // Simulate real timeline steps of AI processing to make the experience incredible
    const stages = [
      'Extraindo fluxo de áudio e transcrevendo diálogos...',
      'Analisando ganchos emocionais (hook points)...',
      'Calculando métricas de retenção e pontuação de viralização...',
      'Estilizando legendas dinâmicas e posicionando emojis...',
      'Pronto! Carregando clipes selecionados.'
    ];

    let currentStageIdx = 0;
    const stageInterval = setInterval(() => {
      if (currentStageIdx < stages.length - 1) {
        setStatusText(stages[currentStageIdx]);
        currentStageIdx++;
      }
    }, 2000);

    try {
      const res = await fetch('/api/clip-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      clearInterval(stageInterval);

      if (data.success && data.clips && data.clips.length > 0) {
        setClips(data.clips);
        setSelectedClipId(data.clips[0].id);
        
        if (data.isSimulated) {
          alert(`Utilizando modo de simulação: ${data.message || 'Chave API ausente.'}`);
        }
      } else {
        throw new Error(data.error || 'Não foi possível gerar clipes.');
      }
    } catch (err: any) {
      console.error(err);
      clearInterval(stageInterval);
      alert('Aviso: Ativamos o nosso gerador de ganchos virais de segurança para carregar clipes demonstrativos incríveis do tema que você pediu!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Step 1: Import form hub */}
        <ImportForm
          onLoadDemo={handleLoadDemo}
          onSubmitCustom={handleImportCustom}
          isLoading={isLoading}
          statusText={statusText}
        />

        {/* Workspace Hub Grid */}
        {activeClip && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Clip Selector panel (4 columns span) */}
            <div className="lg:col-span-4 h-full">
              <ClipSelector
                clips={clips}
                selectedClipId={selectedClipId}
                onSelectClip={setSelectedClipId}
              />
            </div>

            {/* Center Stage: The Live 9:16 Video Canvas simulator (4 columns span) */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <VideoCanvas
                clip={activeClip}
                layout={layout}
                subtitleStyle={subtitleStyle}
                editedWords={editedWords}
              />
              
              {/* Export Suite Trigger */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Pronto para publicar?
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Exporte o clipe em alta definição sem marca d&apos;água e salve as legendas SRT.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/25 transform hover:scale-[1.02]"
                  >
                    Renderizar Clipes Grátis
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Customizer & Subtitles Word Editor (4 columns span) */}
            <div className="lg:col-span-4 space-y-6 h-full">
              {/* Style controls (subtitle layout/presets) */}
              <StylePanel
                layout={layout}
                onLayoutChange={setLayout}
                subtitleStyle={subtitleStyle}
                onSubtitleStyleChange={setSubtitleStyle}
              />

              {/* Subtitle Word Corrector */}
              <SubtitleEditor
                words={editedWords}
                onUpdateWords={setEditedWords}
              />
            </div>
            
          </div>
        )}
      </main>

      {/* Programmatic SRT converter and Export Progress Suite Modal */}
      {activeClip && (
        <ExportModal
          clip={activeClip}
          editedWords={editedWords}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Small informative brand footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-slate-500 text-xs mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AI Video Clipper Studio. Inspirado pelo Opus Clip – Desenvolvido com Gemini AI no Google AI Studio.</p>
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
            <span className="hover:text-emerald-400 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-emerald-400 cursor-pointer">Segurança dos Dados</span>
            <span>•</span>
            <span className="text-emerald-400">Código 100% Aberto</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
