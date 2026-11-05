import React, { useState } from 'react';
import { X, Sparkles, Wand2, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { SkillLevel, SlashCommand } from '../types/command';
import { generateCommandWithAi } from '../services/aiGenerator';
import { CATEGORIES } from '../data/categories';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandGenerated: (command: SlashCommand) => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onCommandGenerated,
}) => {
  const [promptText, setPromptText] = useState('');
  const [level, setLevel] = useState<SkillLevel>('Intermediate');
  const [categoryPreference, setCategoryPreference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickSamples = [
    'Bantu siswa SMK belajar pemrograman Python dari nol sampai buat game.',
    'Bongkar paper AI terbaru ke format ringkasan eksekutif 5 menit.',
    'Formula copywriting iklan produk kecantikan dengan teknik AIDA & PAS.',
    'Simulasi arsitektur microservices e-commerce skala 100k transaksi.',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const generated = await generateCommandWithAi({
        promptText: promptText.trim(),
        level,
        categoryPreference: categoryPreference || undefined,
      });
      onCommandGenerated(generated);
      onClose();
    } catch (err: any) {
      console.error('AI Generator Error:', err);
      setError(err?.message || 'Gagal menghasilkan command. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const levels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-lg flex flex-col bg-[#0b1325] border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Futuristic Glow */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                AI Prompt Generator
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                  Natural Language
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Ubah ide bahasa alami menjadi Slash Command siap pakai
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleGenerate} className="p-5 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Textarea Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deskripsikan kebutuhan command Anda:
            </label>
            <textarea
              required
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Contoh: Buat command untuk membantu siswa SMK belajar pemrograman Python dari nol sampai siap magang..."
              className="w-full px-3.5 py-3 rounded-2xl bg-[#111A2B] border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed"
            />
          </div>

          {/* Quick Idea Samples */}
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
              💡 Coba Contoh Cepat:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(sample)}
                  className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/40 text-slate-300 transition"
                >
                  "{sample.slice(0, 36)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tingkat Kompleksitas (Skill Level):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {levels.map((lvl) => {
                const isSelected = level === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                      isSelected
                        ? 'bg-gradient-to-b from-blue-600/30 to-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'bg-[#111A2B] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Preference (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Preferensi Kategori <span className="text-slate-500">(Opsional - Otomatis terdeteksi)</span>:
            </label>
            <select
              value={categoryPreference}
              onChange={(e) => setCategoryPreference(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Deteksi Otomatis Berdasarkan Teks</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  /{c.slug} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !promptText.trim()}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:brightness-110 disabled:opacity-50 text-white text-xs font-bold shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mensintesis Slash Command Profesional...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-cyan-300" />
                <span>Generate Slash Command Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
