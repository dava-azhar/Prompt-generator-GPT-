import React, { useState } from 'react';
import { Copy, Check, Bookmark, Flame, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { SlashCommand } from '../types/command';

interface CommandCardProps {
  command: SlashCommand;
  onSelect: (command: SlashCommand) => void;
  onCopy: (command: SlashCommand) => void;
  onToggleFavorite: (commandId: string) => void;
  onEdit?: (command: SlashCommand) => void;
  onDelete?: (commandId: string) => void;
  isCustom?: boolean;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  onSelect,
  onCopy,
  onToggleFavorite,
  onEdit,
  onDelete,
  isCustom = false,
}) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(command);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1800);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(command.commandId);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(command);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm(`Hapus command ${command.name}?`)) {
      onDelete(command.commandId);
    }
  };

  return (
    <div
      onClick={() => onSelect(command)}
      className="group relative flex flex-col justify-between p-4 rounded-2xl bg-[#111A2B] border border-slate-800/80 hover:border-blue-500/40 shadow-md hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
    >
      <div>
        {/* Top row: Category tag & Favorite / Menu buttons */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
              /{command.category}
            </span>
            {isCustom && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Custom
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isCustom && onEdit && (
              <button
                onClick={handleEditClick}
                className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition"
                title="Edit Command"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {isCustom && onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
                title="Hapus Command"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-xl transition ${
                command.isFavorite
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/80'
              }`}
              title={command.isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${command.isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Command Name */}
        <h3 className="font-mono font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 truncate">
          <span>{command.name}</span>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {command.description}
        </p>

        {/* Quick parameters hint */}
        {command.parameters && (
          <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
            {command.parameters.split('\n')[0]}
          </div>
        )}
      </div>

      {/* Bottom Bar: Usage Count & 1-Click Copy */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{command.usageCount || 0}x dipakai</span>
        </div>

        <button
          onClick={handleCopyClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 ${
            justCopied
              ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
              : 'bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300'
          }`}
          title="Salin Command ke Clipboard"
        >
          {justCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
