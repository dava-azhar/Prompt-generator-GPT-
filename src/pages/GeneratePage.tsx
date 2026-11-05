import React, { useState } from 'react';
import { 
  Wand2, Sparkles, Copy, Check, Save, RotateCcw, 
  Terminal, ShieldCheck, ChevronRight, Eye, Code, ArrowRight 
} from 'lucide-react';
import { SlashCommand } from '../types/command';
import { CATEGORIES } from '../data/categories';
import { formatCommandOutput } from '../utils/formatter';

interface GeneratePageProps {
  onSaveCommand: (command: SlashCommand) => void;
  onCopyCommand: (command: SlashCommand) => void;
  onOpenAiGenerator: () => void;
}

export const GeneratePage: React.FC<GeneratePageProps> = ({
  onSaveCommand,
  onCopyCommand,
  onOpenAiGenerator,
}) => {
  // Form input states
  const [name, setName] = useState('/study-mastery');
  const [category, setCategory] = useState('study');
  const [objective, setObjective] = useState('Membantu memahami konsep rumit dengan metode bertahap dan analogi.');
  const [targetUser, setTargetUser] = useState('Pelajar dan profesional pemula yang butuh kejelasan konsep');
  const [tone, setTone] = useState('Ramah, lugas, edukatif, dan menyemangati');
  const [detailLevel, setDetailLevel] = useState('Menengah (Analogi + Langkah Konkret)');
  const [outputFormat, setOutputFormat] = useState('1. Analogi Ringkas\n2. Bedah Komponen Inti\n3. Contoh Kasus Nyata\n4. Kuis Refleksi');
  const [additionalInstructions, setAdditionalInstructions] = useState('Hindari jargon tanpa penjelasan. Gunakan contoh kasus sehari-hari di Indonesia.');
  const [parameters, setParameters] = useState('[TOPIK_UTAMA: materi yang dipelajari]\n[TINGKAT: SD/SMP/SMA/Kuliah/Umum]');
  const [qualityControl, setQualityControl] = useState('Zero jargon rumit, alur penjelasan runtut, dan langsung bisa diaplikasikan.');
  const [examples, setExamples] = useState('/study-mastery [TOPIK_UTAMA: Cara Kerja Mesin Roket, TINGKAT: SMA]');

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);

  // Generate role automatically or dynamically
  const computedRole = `Spesialis Senior di bidang ${category.toUpperCase()} & Pedagogi Instruksional`;

  const generatedCommand: SlashCommand = {
    commandId: `gen-${Date.now()}`,
    userId: 'user',
    name: name.startsWith('/') ? name : `/${name}`,
    category,
    description: objective,
    role: computedRole,
    objective,
    context: `Target Pengguna: ${targetUser}. Gaya Bahasa: ${tone}. Tingkat Detail: ${detailLevel}.`,
    instructions: `1. Analisis tujuan: ${objective}
2. Terapkan gaya bahasa ${tone} dan tingkat kedalaman ${detailLevel}.
3. Eksekusi instruksi: ${additionalInstructions}
4. Sajikan keluaran tepat sesuai format output yang ditentukan.`,
    parameters,
    outputFormat,
    qualityControl,
    examples,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 1,
    isFavorite: false,
    tags: [category, 'generator'],
  };

  const previewText = formatCommandOutput(generatedCommand);

  const handleCopy = () => {
    onCopyCommand(generatedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveCommand(generatedCommand);
  };

  const handleReset = () => {
    setName('/custom-command');
    setCategory('study');
    setObjective('');
    setTargetUser('');
    setTone('Profesional & Lugas');
    setDetailLevel('Lengkap & Terstruktur');
    setOutputFormat('1. Ringkasan Eksekutif\n2. Solusi Teknis\n3. Checklist Aksi');
    setAdditionalInstructions('');
    setParameters('[PARAMETER: keterangan]');
    setQualityControl('Akurat, bebas kesalahan logika.');
    setExamples('');
  };

  return (
    <div className="space-y-5 pb-24">
      
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#111A2B] to-purple-950/60 border border-blue-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Wand2 className="w-3 h-3 text-cyan-400" />
            Interactive Studio
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Interactive Command Generator
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Konfigurasi parameter komprehensif untuk menciptakan Slash Command GPT berstandar enterprise.
          </p>
        </div>

        {/* Quick Launch Natural Language AI Prompt Generator */}
        <button
          onClick={onOpenAiGenerator}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-white animate-spin" />
          <span>Mode Bahasa Alami (AI)</span>
        </button>
      </div>

      {/* Tabs Switcher: Editor vs Live Output */}
      <div className="flex items-center p-1 rounded-2xl bg-[#111A2B] border border-slate-800">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'editor'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Formulir Parameter</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Template Output Siap Pakai</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'editor' ? (
        <div className="space-y-4">
          
          {/* Section 1: Command Identity */}
          <div className="p-4 rounded-2xl bg-[#111A2B] border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              1. Identitas & Kategori
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Slash Command
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="/nama-command"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      /{cat.slug} — {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Purpose & Audience */}
          <div className="p-4 rounded-2xl bg-[#111A2B] border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              2. Tujuan & Target Pengguna
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tujuan Utama (Objective)
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Apa hasil akhir yang ingin dicapai pengguna?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Pengguna
                </label>
                <input
                  type="text"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  placeholder="e.g. Mahasiswa, developer pemula, solo founder"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gaya Bahasa (Tone of Voice)
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g. Ramah, kritis analitis, persuasif"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Deep Instructions & Format */}
          <div className="p-4 rounded-2xl bg-[#111A2B] border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              3. Format Output & Instruksi Khusus
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tingkat Detail
                </label>
                <select
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Ringkas (Executive Summary)">Ringkas (Executive Summary)</option>
                  <option value="Menengah (Analogi + Langkah Konkret)">Menengah (Analogi + Langkah Konkret)</option>
                  <option value="Mendalam (Arsitektural & Edge Cases)">Mendalam (Arsitektural & Edge Cases)</option>
                  <option value="Ensiklopedis (Kamus Komprehensif)">Ensiklopedis (Kamus Komprehensif)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Parameter Input
                </label>
                <input
                  type="text"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  placeholder="[VARIABEL: keterangan]"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs font-mono text-amber-300/90 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Format Output yang Diharapkan
              </label>
              <textarea
                rows={3}
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="1. Poin Utama&#10;2. Solusi Langkah Demi Langkah"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Instruksi Tambahan AI
              </label>
              <textarea
                rows={2}
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="Pantangan khusus, batasan kata, dll..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D19] border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition active:scale-95 border border-slate-700"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simpan ke Koleksi</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Template'}</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Preview Tab */
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">
              Struktur Command Profesional HarrisDev:
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simpan</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Command'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-3xl bg-[#080D19] border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all shadow-inner">
            {previewText}
          </pre>
        </div>
      )}

    </div>
  );
};
