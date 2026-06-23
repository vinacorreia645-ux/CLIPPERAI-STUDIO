import React, { useRef, useState, useEffect } from 'react';
import { VideoClip, SubtitleStyle, VideoLayout, SubtitleWord } from '../types';
import { Play, Pause, RotateCcw, Smartphone, Maximize, Scissors, AlignCenter, Layers, Move } from 'lucide-react';

interface VideoCanvasProps {
  clip: VideoClip;
  layout: VideoLayout;
  subtitleStyle: SubtitleStyle;
  editedWords: SubtitleWord[];
}

export default function VideoCanvas({ clip, layout, subtitleStyle, editedWords }: VideoCanvasProps) {
  const primaryVideoRef = useRef<HTMLVideoElement>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [cropOffset, setCropOffset] = useState(50); // percentage (0 to 100) to shift video horizontally
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(50);

  // Sync and control video looping within clip boundaries
  useEffect(() => {
    const mainVideo = primaryVideoRef.current;
    if (!mainVideo) return;

    // Reset to start of clip when clip changes
    mainVideo.currentTime = clip.startTime;
    setCurrentTime(0);
    setIsPlaying(false);
    mainVideo.pause();

    if (secondaryVideoRef.current) {
      secondaryVideoRef.current.currentTime = 0;
      secondaryVideoRef.current.pause();
    }
  }, [clip]);

  // Sync play/pause between dual videos in split-screen mode
  const togglePlay = () => {
    const mainVideo = primaryVideoRef.current;
    const secondaryVideo = secondaryVideoRef.current;
    if (!mainVideo) return;

    if (isPlaying) {
      mainVideo.pause();
      if (secondaryVideo) secondaryVideo.pause();
      setIsPlaying(false);
    } else {
      // Ensure we are inside bounds
      const elapsed = mainVideo.currentTime - clip.startTime;
      if (elapsed < 0 || elapsed > (clip.endTime - clip.startTime)) {
        mainVideo.currentTime = clip.startTime;
      }
      
      mainVideo.play().then(() => {
        setIsPlaying(true);
        if (secondaryVideo && layout === 'split-screen') {
          secondaryVideo.play().catch(() => {});
        }
      }).catch(err => {
        console.error("Video play failed:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    const mainVideo = primaryVideoRef.current;
    if (!mainVideo) return;

    const absoluteTime = mainVideo.currentTime;
    const elapsed = absoluteTime - clip.startTime;

    // Check bounds: loop if past clip end time or before start time
    const duration = clip.endTime - clip.startTime;
    if (elapsed < 0 || elapsed > duration) {
      mainVideo.currentTime = clip.startTime;
      setCurrentTime(0);
      
      if (secondaryVideoRef.current) {
        secondaryVideoRef.current.currentTime = 0;
      }
    } else {
      setCurrentTime(elapsed);
    }

    // Sync secondary video if playing
    if (layout === 'split-screen' && secondaryVideoRef.current && isPlaying) {
      const secVideo = secondaryVideoRef.current;
      // loop secondary video if it ends
      if (secVideo.ended || secVideo.currentTime > 20) {
        secVideo.currentTime = 0;
        secVideo.play().catch(() => {});
      }
    }
  };

  const handleRestart = () => {
    const mainVideo = primaryVideoRef.current;
    if (!mainVideo) return;
    mainVideo.currentTime = clip.startTime;
    setCurrentTime(0);
    if (isPlaying) {
      mainVideo.play().catch(() => {});
      if (secondaryVideoRef.current && layout === 'split-screen') {
        secondaryVideoRef.current.currentTime = 0;
        secondaryVideoRef.current.play().catch(() => {});
      }
    } else {
      if (secondaryVideoRef.current) secondaryVideoRef.current.currentTime = 0;
    }
  };

  // Draggable horizontal crop handlers (Horizontal Pan)
  const handleCropMouseDown = (e: React.MouseEvent) => {
    if (layout !== 'vertical-crop') return;
    setIsDraggingCrop(true);
    dragStartX.current = e.clientX;
    dragStartOffset.current = cropOffset;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingCrop) return;
      const deltaX = e.clientX - dragStartX.current;
      const movementPercent = (deltaX / 300) * 100; // 300px width reference
      let newOffset = dragStartOffset.current - movementPercent;
      newOffset = Math.max(0, Math.min(100, newOffset));
      setCropOffset(newOffset);
    };

    const handleMouseUp = () => {
      setIsDraggingCrop(false);
    };

    if (isDraggingCrop) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCrop]);

  // Determine active spoken word
  const activeWordIndex = editedWords.findIndex(
    w => currentTime >= w.start && currentTime <= w.end
  );

  // Group subtitles into visual small segments (2-3 words) to render stably
  const getSubtitleSegment = () => {
    if (editedWords.length === 0) return { segment: [], activeIndexInSeg: -1 };

    // Default to first few words if nothing is playing yet
    if (activeWordIndex === -1) {
      return {
        segment: editedWords.slice(0, 3),
        activeIndexInSeg: -1
      };
    }

    // Chunk size: 3 words
    const segmentSize = 3;
    const startIdx = Math.max(0, activeWordIndex - (activeWordIndex % segmentSize));
    const segment = editedWords.slice(startIdx, startIdx + segmentSize);
    const activeIndexInSeg = activeWordIndex - startIdx;

    return { segment, activeIndexInSeg };
  };

  const { segment, activeIndexInSeg } = getSubtitleSegment();
  const currentActiveWord = activeWordIndex !== -1 ? editedWords[activeWordIndex] : null;

  // Generate subtitle style classes
  const renderStyledSubtitles = () => {
    if (segment.length === 0) return null;

    return (
      <div className="absolute inset-x-4 bottom-16 flex flex-col items-center justify-center text-center z-30 select-none pointer-events-none">
        {/* Render bouncy emoji right above the highlighted active word */}
        {currentActiveWord?.emoji && (
          <div className="text-4xl mb-2 animate-bounce scale-110 drop-shadow-md select-none">
            {currentActiveWord.emoji}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 rounded-xl">
          {segment.map((word, idx) => {
            const isActive = idx === activeIndexInSeg;
            
            if (subtitleStyle === 'hormozi') {
              // Alex Hormozi Style: uppercase, thick bold, green/yellow pop
              return (
                <span
                  key={idx}
                  className={`font-display font-black text-2xl uppercase tracking-tighter transition-all duration-100 ${
                    isActive
                      ? word.style === 'accent'
                        ? 'text-emerald-400 scale-125 rotate-2 drop-shadow-[0_4px_12px_rgba(16,185,129,0.5)]'
                        : 'text-amber-300 scale-125 -rotate-2 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]'
                      : 'text-white scale-100'
                  }`}
                >
                  {word.text}
                </span>
              );
            } else if (subtitleStyle === 'neon') {
              // Neon Cyber Style: thin glow, cyan outline, pink/magenta active state
              return (
                <span
                  key={idx}
                  className={`font-mono font-bold text-xl tracking-tight transition-all duration-100 uppercase ${
                    isActive
                      ? 'text-pink-500 font-extrabold scale-110 glow-text drop-shadow-[0_0_10px_#ec4899]'
                      : 'text-cyan-300 opacity-80'
                  }`}
                  style={{
                    textShadow: isActive ? '0 0 8px #ec4899' : '0 0 3px #06b6d4'
                  }}
                >
                  {word.text}
                </span>
              );
            } else if (subtitleStyle === 'bold-retro') {
              // Retro Cartoon Bold: dark border stroke, yellow highlight
              return (
                <span
                  key={idx}
                  className={`font-display font-extrabold text-2xl tracking-wide transition-all duration-100 ${
                    isActive
                      ? 'text-amber-400 scale-120 border-b-4 border-amber-500'
                      : 'text-white'
                  }`}
                  style={{
                    textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000'
                  }}
                >
                  {word.text}
                </span>
              );
            } else {
              // Clean Minimal
              return (
                <span
                  key={idx}
                  className={`font-sans text-base px-1.5 py-0.5 rounded transition-all duration-100 ${
                    isActive
                      ? 'bg-white text-slate-950 font-semibold scale-105'
                      : 'text-slate-200'
                  }`}
                >
                  {word.text}
                </span>
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-between w-full mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Visualização Ativa: </span>
          <strong className="text-white uppercase">{layout.replace('-', ' ')}</strong>
        </div>
        {layout === 'vertical-crop' && (
          <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
            <Move className="w-3 h-3 text-emerald-400" />
            Arraste o vídeo para focar o orador
          </span>
        )}
      </div>

      {/* Simulator Device Shell */}
      <div className="relative flex items-center justify-center w-full">
        <div className={`relative overflow-hidden bg-slate-950 border-4 border-slate-800 rounded-[32px] shadow-2xl transition-all duration-300 ${
          layout === 'widescreen'
            ? 'w-full max-w-[480px] aspect-video rounded-2xl'
            : 'w-[280px] h-[497px]' // 9:16 mobile representation
        }`}>
          {/* Camera Crop / Draggable Surface indicator */}
          <div 
            className="w-full h-full relative cursor-grab active:cursor-grabbing"
            onMouseDown={handleCropMouseDown}
          >
            {/* Split Screen Video Mode */}
            {layout === 'split-screen' ? (
              <div className="flex flex-col h-full w-full">
                {/* Speaker on top */}
                <div className="h-1/2 w-full border-b-2 border-slate-800 relative overflow-hidden bg-black">
                  <video
                    ref={primaryVideoRef}
                    src={clip.videoUrl || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e339f37d9c12b9eae1d74664924&profile_id=165&oauth2_token_id=57447761"}
                    className="absolute h-full w-auto max-w-none top-0 left-1/2 -translate-x-1/2 pointer-events-none object-cover"
                    playsInline
                    muted
                    onTimeUpdate={handleTimeUpdate}
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 text-[8px] uppercase tracking-wider font-mono text-emerald-400 px-2 py-0.5 rounded">
                    Orador IA
                  </div>
                </div>
                {/* Satisfying Mobile Gameplay on bottom */}
                <div className="h-1/2 w-full relative overflow-hidden bg-slate-950">
                  <video
                    ref={secondaryVideoRef}
                    src={clip.secondaryVideoUrl || "https://player.vimeo.com/external/510850877.sd.mp4?s=d0084fa606f23348001e3e8ef6e91cf2547e7041&profile_id=165&oauth2_token_id=57447761"}
                    className="absolute h-full w-full object-cover pointer-events-none"
                    playsInline
                    loop
                    muted
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 text-[8px] uppercase tracking-wider font-mono text-amber-400 px-2 py-0.5 rounded">
                    Satisfying Gameplay
                  </div>
                </div>
              </div>
            ) : (
              // Standard single video rendering (Vertical Crop or Widescreen)
              <div className="w-full h-full relative overflow-hidden">
                <video
                  ref={primaryVideoRef}
                  src={clip.videoUrl || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e339f37d9c12b9eae1d74664924&profile_id=165&oauth2_token_id=57447761"}
                  className={`absolute max-w-none pointer-events-none ${
                    layout === 'widescreen'
                      ? 'w-full h-full object-cover top-0 left-0'
                      : 'h-full w-auto top-0 object-cover'
                  }`}
                  style={
                    layout === 'vertical-crop'
                      ? { left: `${cropOffset}%`, transform: 'translateX(-50%)' }
                      : {}
                  }
                  playsInline
                  muted
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
            )}

            {/* Render Subtitles Overlay dynamically synchronized */}
            {renderStyledSubtitles()}

            {/* Shadow gradients for cinematic aesthetic overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none z-10" />
          </div>
        </div>
      </div>

      {/* Media Controller Console */}
      <div className="w-full max-w-[320px] mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>{currentTime.toFixed(1)}s</span>
          <div className="h-1 flex-1 mx-3 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="absolute h-full bg-emerald-500 rounded-full"
              style={{
                width: `${
                  ((currentTime) / (clip.endTime - clip.startTime || 1)) * 100
                }%`
              }}
            />
          </div>
          <span>{(clip.endTime - clip.startTime).toFixed(1)}s</span>
        </div>

        <div className="flex items-center justify-center gap-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
          <button
            onClick={handleRestart}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
            title="Recomeçar clipe"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all transform hover:scale-105"
            title={isPlaying ? 'Pausar clipe' : 'Reproduzir clipe'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              const mainVideo = primaryVideoRef.current;
              if (mainVideo) {
                mainVideo.muted = !mainVideo.muted;
              }
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
            title="Mudar Som"
          >
            <span className="text-xs font-mono font-bold">MUTED</span>
          </button>
        </div>
      </div>
    </div>
  );
}
