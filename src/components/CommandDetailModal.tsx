import React, { useState } from 'react';
import { 
  X, Copy, Check, Bookmark, FileText, Download, 
  Edit3, Share2, Sparkles, Terminal, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { SlashCommand } from '../types/command';
import { formatCommandOutput } from '../utils/formatter';
import { exportCommandAsTxt, exportCommandAsMarkdown } from '../utils/exporter';

interface CommandDetailModalProps {
  command: SlashCommand | null;
  onClose: () => void;
  onCopy: (command: SlashCommand) => void;
  onToggleFavorite: (commandId: string) => void;
  onEdit?: (command: SlashCommand) => void;
  isCustom?: boolean;
}

export const CommandDetailModal: React.FC<CommandDetailModalProps> = ({
  command,
  onClose,
  onCopy,
  onToggleFavorite,
  onEdit,
  isCustom = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'structured' | 'raw'>('structured');

  if (!command) return null;

  const handleCopy = () => {
    onCopy(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedOutput = formatCommandOutput(command);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0b1325] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-[#111A2B]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/15 text-cyan-400 border border-cyan-500/30">
              /{command.category}
            </span>
            <span className="text-xs text-slate-400 font-mono truncate">
              {command.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(command.commandId)}
              className={`p-2 rounded-xl transition ${
                command.isFavorite 
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' 
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
              }`}
              title="Favorit"
            >
              <Bookmark className={`w-4 h-4 ${command.isFavorite ? 'fill-rose-400' : ''}`} />
            </button>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(command);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition"
                title="Edit Command"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-mono font-bold text-slate-100 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                {command.name}
              </span>
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
              {command.description}
            </p>
          </div>

          {/* Toggle View: Structured vs Raw Command */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveView('structured')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'structured'
                  ? 'bg-blue-600/30 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tampilan Terstruktur
            </button>
            <button
              onClick={() => setActiveView('raw')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'raw'
                  ? 'bg-blue-600/30 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Template Siap Copy
            </button>
          </div>

          {activeView === 'structured' ? (
            <div className="space-y-3.5">
              
              {/* Role & Objective Box */}
              <div className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Role & Objective
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <p><strong className="text-slate-200">Role:</strong> {command.role || 'AI Expert Specialist'}</p>
                  <p><strong className="text-slate-200">Objective:</strong> {command.objective}</p>
                  {command.context && (
                    <p><strong className="text-slate-200">Context:</strong> {command.context}</p>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  Instruksi Terperinci
                </div>
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-[#080D19]/60 p-3 rounded-xl border border-slate-800/80">
                  {command.instructions}
                </pre>
              </div>

              {/* Parameters */}
              {command.parameters && (
                <div className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                    ⚙️ Parameter Input
                  </div>
                  <pre className="text-xs text-amber-300/90 font-mono whitespace-pre-wrap bg-[#080D19]/60 p-2.5 rounded-xl border border-amber-500/20">
                    {command.parameters}
                  </pre>
                </div>
              )}

              {/* Output Format & Quality Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800">
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                    📤 Output Format
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans">
                    {command.outputFormat}
                  </pre>
                </div>

                {command.qualityControl && (
                  <div className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Quality Control
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {command.qualityControl}
                    </p>
                  </div>
                )}
              </div>

              {/* Examples */}
              {command.examples && (
                <div className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    💡 Contoh Penggunaan
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300/90 break-words">
                    {command.examples}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div>
              <pre className="p-4 rounded-2xl bg-[#080D19] border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                {formattedOutput}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800/80 bg-[#111A2B]/80 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2">
          
          {/* Export Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportCommandAsTxt(command)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-[11px] font-medium text-slate-300 transition"
              title="Unduh file .txt"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>TXT</span>
            </button>

            <button
              onClick={() => exportCommandAsMarkdown(command)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-[11px] font-medium text-slate-300 transition"
              title="Unduh file Markdown .md"
            >
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Markdown</span>
            </button>
          </div>

          {/* Copy Prompt Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-600/25 hover:brightness-110'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Command Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Command (1-Click)</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
