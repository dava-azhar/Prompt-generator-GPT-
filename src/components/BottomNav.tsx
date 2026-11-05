import React from 'react';
import { Home, Compass, Wand2, Bookmark, User as UserIcon } from 'lucide-react';
import { ActiveTab } from '../types/command';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, favoritesCount }) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'explore' as ActiveTab, label: 'Explore', icon: Compass },
    { id: 'generate' as ActiveTab, label: 'Generate', icon: Wand2, highlight: true },
    { id: 'favorites' as ActiveTab, label: 'Favorit', icon: Bookmark, badge: favoritesCount > 0 ? favoritesCount : null },
    { id: 'profile' as ActiveTab, label: 'Profil', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1325]/95 backdrop-blur-2xl border-t border-slate-800/90 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className="flex flex-col items-center justify-center -mt-4 group relative focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-90 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-blue-500/40 ring-2 ring-cyan-400/50' 
                    : 'bg-gradient-to-tr from-blue-600/90 via-indigo-600/90 to-cyan-500/90 text-white shadow-blue-600/25'
                }`}>
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className={`text-[10px] mt-1 font-semibold transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-1 relative group focus:outline-none"
            >
              <div className="relative">
                <IconComponent className={`w-5 h-5 transition-transform duration-150 active:scale-90 ${
                  isActive ? 'text-cyan-400 stroke-[2.5]' : 'text-slate-400 group-hover:text-slate-300'
                }`} />

                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight font-medium transition-colors ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                {item.label}
              </span>

              {/* Active bar indicator */}
              {isActive && (
                <div className="w-4 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
