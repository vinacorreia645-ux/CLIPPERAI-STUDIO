import React, { useState } from 'react';
import { SubtitleWord } from '../types';
import { Scissors, Edit, Check, Star, Smile, Type, Trash, Plus } from 'lucide-react';

interface SubtitleEditorProps {
  words: SubtitleWord[];
  onUpdateWords: (newWords: SubtitleWord[]) => void;
}

const POPULAR_EMOJIS = ['🔥', '🚀', '🎯', '💡', '🛑', '👥', '🏆', '⏳', '📱', '🏔️', '🧠', '👑', '💪', '💰', '❌', '✅'];

export default function SubtitleEditor({ words, onUpdateWords }: SubtitleEditorProps) {
  const [editingWordIdx, setEditingWordIdx] = useState<number | null>(null);
  const [tempText, setTempText] = useState('');
  const [activeEmojiPickerIdx, setActiveEmojiPickerIdx] = useState<number | null>(null);

  // Edit word spelling text
  const handleStartEdit = (idx: number, currentText: string) => {
    setEditingWordIdx(idx);
    setTempText(currentText);
  };

  const handleSaveText = (idx: number) => {
    const updated = [...words];
    updated[idx] = { ...updated[idx], text: tempText.trim() };
    onUpdateWords(updated);
    setEditingWordIdx(null);
  };

  // Toggle highlight styling: 'highlight' (yellow), 'accent' (green) or undefined/normal
  const handleToggleStyle = (idx: number, styleType: 'highlight' | 'accent') => {
    const updated = [...words];
    const currentStyle = updated[idx].style;
    
    if (currentStyle === styleType) {
      // remove style if clicked same
      updated[idx] = { ...updated[idx], style: 'normal' };
    } else {
      updated[idx] = { ...updated[idx], style: styleType };
    }
    
    onUpdateWords(updated);
  };

  // Apply emoji
  const handleSelectEmoji = (idx: number, emoji: string | null) => {
    const updated = [...words];
    if (emoji === null) {
      delete updated[idx].emoji;
    } else {
      updated[idx] = { ...updated[idx], emoji };
    }
    onUpdateWords(updated);
    setActiveEmojiPickerIdx(null);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Editor de Legendas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Clique na palavra para corrigir ou mudar o destaque
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
          {words.length} Palavras
        </span>
      </div>

      {/* Grid List of Words */}
      <div className="flex-1 overflow-y-auto max-h-[420px] lg:max-h-[500px] space-y-2.5 pr-1">
        {words.map((word, idx) => {
          const isEditing = editingWordIdx === idx;
          const showEmojiPicker = activeEmojiPickerIdx === idx;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                word.style === 'highlight'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : word.style === 'accent'
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-800'
              }`}
            >
              {/* Spelling Edit Form or View Text */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="text-[10px] font-mono text-slate-600 shrink-0 w-8">
                  {word.start.toFixed(1)}s
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={tempText}
                      onChange={(e) => setTempText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveText(idx)}
                      className="bg-slate-950 border border-emerald-500 focus:outline-none rounded px-2.5 py-1 text-xs text-white flex-1 min-w-0"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveText(idx)}
                      className="p-1.5 bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span
                      onClick={() => handleStartEdit(idx, word.text)}
                      className={`text-xs font-bold font-display cursor-pointer hover:underline truncate ${
                        word.style === 'highlight'
                          ? 'text-amber-300'
                          : word.style === 'accent'
                          ? 'text-emerald-400'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      {word.text}
                    </span>
                    {word.emoji && (
                      <span className="text-sm bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {word.emoji}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Editing controls: style toggle, spelling click, emoji trigger */}
              <div className="flex items-center gap-1.5 shrink-0 justify-end">
                {/* Yellow Highlight Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStyle(idx, 'highlight')}
                  className={`p-1.5 rounded-lg border text-xs transition-all ${
                    word.style === 'highlight'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                  title="Destacar Amarelo (Hormozi)"
                >
                  <Type className="w-3.5 h-3.5" />
                </button>

                {/* Green Highlight Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStyle(idx, 'accent')}
                  className={`p-1.5 rounded-lg border text-xs transition-all ${
                    word.style === 'accent'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                  title="Destaque Verde"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>

                {/* Emoji trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveEmojiPickerIdx(showEmojiPicker ? null : idx)}
                    className={`p-1.5 rounded-lg border text-xs transition-all ${
                      word.emoji
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                    title="Adicionar Emoji"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>

                  {/* Popover Emoji list */}
                  {showEmojiPicker && (
                    <div className="absolute right-0 bottom-full mb-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 shadow-2xl z-40 w-[180px] grid grid-cols-4 gap-1.5">
                      {POPULAR_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleSelectEmoji(idx, emoji)}
                          className="w-7 h-7 flex items-center justify-center text-sm rounded hover:bg-slate-900 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSelectEmoji(idx, null)}
                        className="col-span-4 py-1 text-[10px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/20 transition-all mt-1"
                      >
                        Remover Emoji
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
