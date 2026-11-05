import React from 'react';
import { 
  Sparkles, Compass, Bookmark, Clock, Layers, 
  ArrowRight, Wand2, Search, Flame, ChevronRight,
  GraduationCap, BookOpen, Microscope, PenTool, 
  Palette, Flame as FlameIcon, Image, Network, 
  GitFork, Code2, Bug, Globe, Briefcase, TrendingUp, 
  BookMarked, Presentation, Database, HelpCircle
} from 'lucide-react';
import { SlashCommand } from '../types/command';
import { CATEGORIES } from '../data/categories';
import { CommandCard } from '../components/CommandCard';

interface HomePageProps {
  allCommands: SlashCommand[];
  favoriteCommands: SlashCommand[];
  recentCommands: SlashCommand[];
  customCommands: SlashCommand[];
  onSelectCommand: (cmd: SlashCommand) => void;
  onCopyCommand: (cmd: SlashCommand) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateTab: (tab: any) => void;
  onSelectCategory: (categorySlug: string) => void;
  onOpenAiGenerator: () => void;
}

// Icon helper mapping
const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap, BookOpen, Microscope, PenTool, Sparkles,
  Palette, Flame: FlameIcon, Image, Network, GitFork,
  Code2, Bug, Globe, Briefcase, TrendingUp, Layers,
  BookMarked, Presentation, Database, HelpCircle,
};

export const HomePage: React.FC<HomePageProps> = ({
  allCommands,
  favoriteCommands,
  recentCommands,
  customCommands,
  onSelectCommand,
  onCopyCommand,
  onToggleFavorite,
  onNavigateTab,
  onSelectCategory,
  onOpenAiGenerator,
}) => {
  // Top 4 popular commands
  const popularCommands = React.useMemo(() => {
    return [...allCommands].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4);
  }, [allCommands]);

  return (
    <div className="space-y-6 pb-24">
      
      {/* Hero Greeting Section */}
      <section className="relative overflow-hidden rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#111A2B] via-[#0d1627] to-[#080D19] border border-blue-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-[11px] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>HarrisDev Official Suite</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Selamat datang di{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              HarrisDev Command Studio!
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-lg leading-relaxed">
            Ubah ide menjadi perintah AI yang powerful. Akses 200+ command siap pakai atau ciptakan command kustom dengan generator cerdas.
          </p>

          {/* Quick Action CTA Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-200" />
              <span>AI Prompt Generator</span>
            </button>

            <button
              onClick={() => onNavigateTab('explore')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition active:scale-95"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Cari Command</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5 Dashboard Stats Component */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          Ringkasan Studio
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* Stat 1: Total Commands */}
          <div 
            onClick={() => onNavigateTab('explore')}
            className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800/80 hover:border-blue-500/30 transition cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Total Commands</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {allCommands.length}
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">20 Kategori Lengkap</div>
          </div>

          {/* Stat 2: My Favorites */}
          <div 
            onClick={() => onNavigateTab('favorites')}
            className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800/80 hover:border-rose-500/30 transition cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">My Favorites</span>
              <Bookmark className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {favoriteCommands.length}
            </div>
            <div className="text-[10px] text-rose-400 mt-0.5">Tersimpan Cepat</div>
          </div>

          {/* Stat 3: Recently Used */}
          <div 
            onClick={() => onNavigateTab('explore')}
            className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800/80 hover:border-cyan-500/30 transition cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Recently Used</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {recentCommands.length}
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">Riwayat Pemakaian</div>
          </div>

          {/* Stat 4: My Custom Commands */}
          <div 
            onClick={() => onNavigateTab('generate')}
            className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800/80 hover:border-purple-500/30 transition cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Custom Commands</span>
              <Wand2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {customCommands.length}
            </div>
            <div className="text-[10px] text-purple-400 mt-0.5">Karya Pribadi</div>
          </div>

        </div>
      </section>

      {/* 2-Column Category Grid (20 Kategori) */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Kategori Slash Command
            </h3>
            <p className="text-[11px] text-slate-400">
              20 Kategori Spesialis (Masing-masing 10+ command siap pakai)
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-column mobile grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Code2;
            const count = allCommands.filter(c => c.category.toLowerCase() === cat.slug.toLowerCase()).length;

            return (
              <div
                key={cat.slug}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  onNavigateTab('explore');
                }}
                className={`p-3 rounded-2xl bg-gradient-to-br ${cat.gradient} bg-[#111A2B] border border-slate-800 hover:border-blue-500/50 shadow-sm transition-all duration-150 cursor-pointer active:scale-97 group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: `${cat.color}25`, border: `1px solid ${cat.color}50` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50">
                      {count}
                    </span>
                  </div>

                  <h4 className="font-mono font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                    /{cat.slug}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                  <span>Jelajahi</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Commands Section */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Command Terpopuler Minggu Ini
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Lihat Semua
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularCommands.map((cmd) => (
            <CommandCard
              key={cmd.commandId}
              command={cmd}
              onSelect={onSelectCommand}
              onCopy={onCopyCommand}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
