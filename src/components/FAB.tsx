import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  label?: string;
}

export const FAB: React.FC<FABProps> = ({ onClick, label = 'Command Baru' }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-30 flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-xl shadow-blue-600/30 border border-cyan-400/30 transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none"
      title="Buat Slash Command Baru"
    >
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
        <Plus className="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
      </div>
      <span className="tracking-tight">{label}</span>
    </button>
  );
};
