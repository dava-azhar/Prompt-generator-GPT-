import React from 'react';
import { Sparkles, ShieldCheck, User as UserIcon, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentUser: User | null;
  onOpenProfile: () => void;
  onOpenAiGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onOpenProfile, onOpenAiGenerator }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080D19]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Left: HD Futuristic Monogram Logo & Brand */}
        <div className="flex items-center gap-3">
          {/* Geometrical HD Monogram Badge */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#080D19] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                {/* Tech grid background accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
                <span className="font-extrabold tracking-tighter text-sm bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent select-none font-['Plus_Jakarta_Sans']">
                  HD
                </span>
              </div>
            </div>
            {/* Online Pulse Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#080D19] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1">
                HarrisDev
                <span className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  STUDIO
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-cyan-400 font-medium tracking-tight">
              Slash Command Generator
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick AI Generator Button */}
          <button
            onClick={onOpenAiGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-sm transition active:scale-95"
            title="AI Prompt Synthesizer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden xs:inline">AI Gen</span>
          </button>

          {/* Profile / Account Avatar */}
          <button
            onClick={onOpenProfile}
            className="relative p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition active:scale-95"
            title="Profil Pengguna & Akun"
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Avatar" 
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40" 
              />
            ) : currentUser ? (
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <UserIcon className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
