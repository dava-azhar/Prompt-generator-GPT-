import React, { useRef } from 'react';
import { 
  User as UserIcon, LogIn, LogOut, Download, Upload, 
  Trash2, Edit3, ShieldCheck, Sparkles, Layers, HardDrive, 
  ExternalLink, CheckCircle2 
} from 'lucide-react';
import { User } from 'firebase/auth';
import { SlashCommand } from '../types/command';
import { exportAllCommandsJson, importCommandsFromJsonFile } from '../utils/exporter';

interface ProfilePageProps {
  currentUser: User | null;
  onSignIn: () => Promise<any>;
  onSignOut: () => Promise<void>;
  customCommands: SlashCommand[];
  allCommands: SlashCommand[];
  favoriteCount: number;
  onEditCommand: (cmd: SlashCommand) => void;
  onDeleteCommand: (id: string) => void;
  onSelectCommand: (cmd: SlashCommand) => void;
  onImportCommands: (commands: SlashCommand[]) => void;
  showToast: (type: any, title: string, desc?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onSignIn,
  onSignOut,
  customCommands,
  allCommands,
  favoriteCount,
  onEditCommand,
  onDeleteCommand,
  onSelectCommand,
  onImportCommands,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importCommandsFromJsonFile(file);
      if (imported.length > 0) {
        onImportCommands(imported);
      } else {
        showToast('error', 'File Kosong', 'Tidak ada data command valid dalam file JSON.');
      }
    } catch (err: any) {
      showToast('error', 'Gagal Membaca File', err?.message || 'Format JSON tidak valid.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Account Card */}
      <section className="p-5 rounded-3xl bg-[#111A2B] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Avatar" 
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg" 
              />
            ) : currentUser ? (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <UserIcon className="w-7 h-7" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-100">
                  {currentUser ? currentUser.displayName || 'Developer' : 'Pengguna Tamu (Offline)'}
                </h2>
                {currentUser && (
                  <span className="p-0.5 rounded-full bg-cyan-500/20 text-cyan-400" title="Akun Terhubung">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {currentUser ? currentUser.email : 'Data tersimpan otomatis di perangkat lokal'}
              </p>
              <div className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
                {currentUser ? 'Firebase Cloud Sync: Aktif' : 'Penyimpanan Lokal: Aktif'}
              </div>
            </div>
          </div>

          <div>
            {currentUser ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-slate-700 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
          <div>
            <div className="text-sm font-bold font-mono text-slate-100">{allCommands.length}</div>
            <div className="text-[10px] text-slate-400">Total Library</div>
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-cyan-400">{customCommands.length}</div>
            <div className="text-[10px] text-slate-400">Command Saya</div>
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-rose-400">{favoriteCount}</div>
            <div className="text-[10px] text-slate-400">Favorit</div>
          </div>
        </div>
      </section>

      {/* Backup, Export & Import Section */}
      <section className="p-5 rounded-3xl bg-[#111A2B] border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>Cadangan & Transfer Data (JSON)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Ekspor seluruh koleksi perintah Anda untuk dicadangkan, atau impor file JSON dari perangkat lain.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={() => exportAllCommandsJson(allCommands)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ekspor Semua ({allCommands.length} Command)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Impor File JSON</span>
          </button>
        </div>
      </section>

      {/* My Custom Commands Manager */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Command Kustom Pribadi</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {customCommands.length}
            </span>
          </h3>
        </div>

        {customCommands.length > 0 ? (
          <div className="space-y-2">
            {customCommands.map((cmd) => (
              <div
                key={cmd.commandId}
                onClick={() => onSelectCommand(cmd)}
                className="p-3.5 rounded-2xl bg-[#111A2B] border border-slate-800 hover:border-blue-500/30 flex items-center justify-between gap-3 cursor-pointer transition"
              >
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-300 truncate">
                      {cmd.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      /{cmd.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {cmd.description || cmd.objective}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEditCommand(cmd)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus command ${cmd.name}?`)) {
                        onDeleteCommand(cmd.commandId);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#111A2B]/40 border border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Anda belum membuat command kustom. Coba buat di menu Generate!
            </p>
          </div>
        )}
      </section>

      {/* Official Studio Branding & Watermark */}
      <section className="p-5 rounded-3xl bg-gradient-to-br from-[#0c1322] to-[#080D19] border border-slate-800 text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 mx-auto flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/20">
          HD
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-200">
            HarrisDev GPT Slash Command Generator
          </h4>
          <p className="text-xs text-cyan-400 font-medium">
            "Create Commands. Unlock Intelligence."
          </p>
        </div>
        <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
          Powered by <strong className="text-slate-400">HarrisDev Studio</strong> • Watermark: <strong className="text-cyan-400">HarrisDev Official</strong>
        </p>
      </section>

    </div>
  );
};
