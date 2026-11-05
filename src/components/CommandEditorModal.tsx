import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Eye, Code, ChevronDown } from 'lucide-react';
import { SlashCommand } from '../types/command';
import { CATEGORIES } from '../data/categories';
import { formatCommandOutput } from '../utils/formatter';

interface CommandEditorModalProps {
  initialCommand?: SlashCommand | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (command: SlashCommand) => void;
}

export const CommandEditorModal: React.FC<CommandEditorModalProps> = ({
  initialCommand,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('study');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [objective, setObjective] = useState('');
  const [context, setContext] = useState('');
  const [instructions, setInstructions] = useState('');
  const [parameters, setParameters] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [qualityControl, setQualityControl] = useState('');
  const [examples, setExamples] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialCommand) {
      setName(initialCommand.name);
      setCategory(initialCommand.category || 'study');
      setDescription(initialCommand.description || '');
      setRole(initialCommand.role || '');
      setObjective(initialCommand.objective || '');
      setContext(initialCommand.context || '');
      setInstructions(initialCommand.instructions || '');
      setParameters(initialCommand.parameters || '');
      setOutputFormat(initialCommand.outputFormat || '');
      setQualityControl(initialCommand.qualityControl || '');
      setExamples(initialCommand.examples || '');
    } else {
      // Default template for new command
      setName('/my-command');
      setCategory('study');
      setDescription('');
      setRole('Expert AI Assistant');
      setObjective('');
      setContext('Pengguna memerlukan panduan sistematis.');
      setInstructions('1. Analisis masalah secara menyeluruh.\n2. Berikan solusi terstruktur step-by-step.\n3. Berikan contoh implementasi.');
      setParameters('[TOPIK: subjek utama]');
      setOutputFormat('1. Ringkasan Solusi\n2. Langkah Implementasi\n3. Checklist Evaluasi');
      setQualityControl('Hasil harus lugas, akurat, dan mudah dipahami.');
      setExamples('/my-command [TOPIK: Contoh]');
    }
  }, [initialCommand, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !instructions.trim()) {
      alert('Nama command dan Instruksi wajib diisi.');
      return;
    }

    const formattedName = name.startsWith('/') ? name.trim() : `/${name.trim()}`;

    const commandToSave: SlashCommand = {
      commandId: initialCommand ? initialCommand.commandId : `custom-${Date.now()}`,
      userId: initialCommand?.userId || 'user',
      name: formattedName,
      category,
      description: description.trim() || objective.trim(),
      role: role.trim() || 'Senior Specialist',
      objective: objective.trim() || 'Membantu pengguna mencapai hasil optimal',
      context: context.trim(),
      instructions: instructions.trim(),
      parameters: parameters.trim(),
      outputFormat: outputFormat.trim() || 'Markdown terstruktur',
      qualityControl: qualityControl.trim(),
      examples: examples.trim(),
      createdAt: initialCommand ? initialCommand.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: initialCommand ? initialCommand.usageCount : 0,
      isFavorite: initialCommand ? initialCommand.isFavorite : false,
      tags: [category, 'custom'],
    };

    onSave(commandToSave);
    onClose();
  };

  const currentPreview = formatCommandOutput({
    name,
    role,
    objective,
    context,
    instructions,
    parameters,
    outputFormat,
    qualityControl,
    examples,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0b1325] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#111A2B]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                {initialCommand ? 'Edit Slash Command' : 'Buat Slash Command Baru'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Format profesional standar HarrisDev Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Edit Form' : 'Live Preview'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {showPreview ? (
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Pratinjau Format Slash Command:</p>
              <pre className="p-4 rounded-2xl bg-[#080D19] border border-slate-800 text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed select-all">
                {currentPreview}
              </pre>
            </div>
          ) : (
            <form id="command-form" onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Command Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Command <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="/nama-command"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        /{cat.slug} — {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Singkat (Ringkasan fungsi kartu)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Ringkasan buku metode 80/20 Pareto"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Role & Objective */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Role (Peran AI)
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Guru Sains & Pedagogi Ahli Komunikasi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Objective (Tujuan)
                  </label>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g. Membongkar konsep sulit menjadi analogi sederhana"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Context */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Context (Konteks & Target Pengguna)
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Pengguna pemula yang ingin belajar tanpa jargon teknis"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Instructions (Instruksi Terperinci AI) <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="1. Jelaskan konsep target...&#10;2. Berikan contoh analogi...&#10;3. Uji pemahaman dengan pertanyaan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A2B] border border-slate-700/80 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Parameters & Output Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Parameters (Variabel Input)
                  </label>
                  <textarea
                    rows={2}
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    placeholder="[TOPIK: subjek]&#10;[LEVEL: Beginner/Pro]"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111A2B] border border-slate-700/80 text-xs font-mono text-amber-300/90 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Output Format (Format Hasil)
                  </label>
                  <textarea
                    rows={2}
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    placeholder="1. Ringkasan Eksekutif&#10;2. Poin Implementasi"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111A2B] border border-slate-700/80 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Quality Control & Examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quality Control (Standar Kualitas)
                  </label>
                  <input
                    type="text"
                    value={qualityControl}
                    onChange={(e) => setQualityControl(e.target.value)}
                    placeholder="e.g. Gaya bahasa ramah, nol jargon rumit"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111A2B] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contoh Penggunaan
                  </label>
                  <input
                    type="text"
                    value={examples}
                    onChange={(e) => setExamples(e.target.value)}
                    placeholder="e.g. /my-command [TOPIK: Machine Learning]"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111A2B] border border-slate-700/80 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-[#111A2B] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            form="command-form"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Command</span>
          </button>
        </div>

      </div>
    </div>
  );
};
