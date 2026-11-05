import React from 'react';
import { Bookmark, Download, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { SlashCommand } from '../types/command';
import { CommandCard } from '../components/CommandCard';
import { exportAllCommandsJson } from '../utils/exporter';

interface FavoritesPageProps {
  favoriteCommands: SlashCommand[];
  onSelectCommand: (cmd: SlashCommand) => void;
  onCopyCommand: (cmd: SlashCommand) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateExplore: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favoriteCommands,
  onSelectCommand,
  onCopyCommand,
  onToggleFavorite,
  onNavigateExplore,
}) => {
  return (
    <div className="space-y-4 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-400 fill-rose-400" />
            <span>Koleksi Favorit</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {favoriteCommands.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Akses cepat ke perintah yang paling sering Anda butuhkan
          </p>
        </div>

        {favoriteCommands.length > 0 && (
          <button
            onClick={() => exportAllCommandsJson(favoriteCommands)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            title="Export Favorit ke JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Backup JSON</span>
          </button>
        )}
      </div>

      {/* Favorites List */}
      {favoriteCommands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {favoriteCommands.map((cmd) => (
            <CommandCard
              key={cmd.commandId}
              command={cmd}
              onSelect={onSelectCommand}
              onCopy={onCopyCommand}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 rounded-3xl bg-[#111A2B]/60 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">
              Belum Ada Command Favorit
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Tandai command apa saja dengan ikon bookmark untuk menyimpannya ke koleksi cepat ini.
            </p>
          </div>
          <button
            onClick={onNavigateExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:brightness-110 transition active:scale-95"
          >
            <span>Jelajahi Library Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
