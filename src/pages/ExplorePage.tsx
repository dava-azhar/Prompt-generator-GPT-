import React from 'react';
import { Search, X, Filter, ArrowUpDown, Bookmark, Sparkles, Layers } from 'lucide-react';
import { SlashCommand } from '../types/command';
import { CATEGORIES } from '../data/categories';
import { CommandCard } from '../components/CommandCard';

interface ExplorePageProps {
  filteredCommands: SlashCommand[];
  allCommands: SlashCommand[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: 'popular' | 'newest' | 'az';
  setSortBy: (sort: 'popular' | 'newest' | 'az') => void;
  onSelectCommand: (cmd: SlashCommand) => void;
  onCopyCommand: (cmd: SlashCommand) => void;
  onToggleFavorite: (id: string) => void;
  onEditCommand: (cmd: SlashCommand) => void;
  onDeleteCommand: (id: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  filteredCommands,
  allCommands,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onSelectCommand,
  onCopyCommand,
  onToggleFavorite,
  onEditCommand,
  onDeleteCommand,
}) => {
  return (
    <div className="space-y-4 pb-24">
      
      {/* Title */}
      <div className="px-1">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>Katalog Slash Command</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-cyan-400 border border-blue-500/30">
            {filteredCommands.length}
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Cari 200+ perintah terverifikasi atau filter berdasarkan kategori spesialis
        </p>
      </div>

      {/* Real-time Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama command, kata kunci, topik atau peran AI..."
          className="w-full pl-10 pr-9 py-3 rounded-2xl bg-[#111A2B] border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Horizontal Filter Carousel */}
      <div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-[#111A2B] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Semua ({allCommands.length})
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const count = allCommands.filter(c => c.category.toLowerCase() === cat.slug.toLowerCase()).length;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-[#111A2B] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>/{cat.slug}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting Controls Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span>Urutkan:</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortBy('popular')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              sortBy === 'popular'
                ? 'bg-blue-500/20 text-cyan-300 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            Paling Sering Digunakan
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              sortBy === 'newest'
                ? 'bg-blue-500/20 text-cyan-300 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            Terbaru
          </button>
          <button
            onClick={() => setSortBy('az')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              sortBy === 'az'
                ? 'bg-blue-500/20 text-cyan-300 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            A-Z
          </button>
        </div>
      </div>

      {/* Commands Grid */}
      {filteredCommands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {filteredCommands.map((cmd) => (
            <CommandCard
              key={cmd.commandId}
              command={cmd}
              onSelect={onSelectCommand}
              onCopy={onCopyCommand}
              onToggleFavorite={onToggleFavorite}
              onEdit={cmd.userId !== 'system' ? onEditCommand : undefined}
              onDelete={cmd.userId !== 'system' ? onDeleteCommand : undefined}
              isCustom={cmd.userId !== 'system'}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 rounded-3xl bg-[#111A2B]/60 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">
            Tidak Ada Command yang Cocok
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Tidak ditemukan command dengan kata kunci "{searchQuery}". Coba kata kunci lain atau buat command baru.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600/20 text-cyan-300 text-xs font-semibold hover:bg-blue-600/30 transition"
          >
            Reset Pencarian
          </button>
        </div>
      )}

    </div>
  );
};
