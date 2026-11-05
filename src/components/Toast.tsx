import React from 'react';
import { CheckCircle2, Info, AlertCircle, Copy, X } from 'lucide-react';
import { ToastMessage } from '../hooks/useToast';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        let borderColor = 'border-emerald-500/30';
        let bgGradient = 'from-emerald-950/80 to-slate-900/95';

        if (toast.type === 'copied') {
          icon = <Copy className="w-4 h-4 text-cyan-400 shrink-0" />;
          borderColor = 'border-cyan-500/40 shadow-cyan-500/10';
          bgGradient = 'from-blue-950/90 to-slate-900/95';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-blue-400 shrink-0" />;
          borderColor = 'border-blue-500/30';
          bgGradient = 'from-blue-950/80 to-slate-900/95';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderColor = 'border-rose-500/30';
          bgGradient = 'from-rose-950/80 to-slate-900/95';
        }

        return (
          <div
            key={toast.id}
            className={`w-full max-w-sm pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${bgGradient} border ${borderColor} shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in slide-in-from-top-3`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-1 rounded-xl bg-slate-800/60 border border-slate-700/50">
                {icon}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-100 truncate">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
