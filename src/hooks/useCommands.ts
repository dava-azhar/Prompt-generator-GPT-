import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { SlashCommand } from '../types/command';
import { ALL_SEED_COMMANDS } from '../data/seedCommands';
import { 
  getLocalCustomCommands, 
  saveLocalCustomCommands, 
  getLocalFavoriteIds, 
  saveLocalFavoriteIds, 
  getLocalRecentIds, 
  saveLocalRecentIds, 
  getLocalUsageCounts, 
  saveLocalUsageCounts,
  syncCommandToFirestore,
  deleteCommandFromFirestore,
  fetchUserCommandsFromFirestore
} from '../services/storage';
import { formatForDirectPrompt } from '../utils/formatter';
import { User } from 'firebase/auth';

export function useCommands(currentUser: User | null, showToast: (type: any, title: string, desc?: string) => void) {
  const [customCommands, setCustomCommands] = useState<SlashCommand[]>(() => getLocalCustomCommands());
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getLocalFavoriteIds());
  const [recentIds, setRecentIds] = useState<string[]>(() => getLocalRecentIds());
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>(() => getLocalUsageCounts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'az'>('popular');

  // Load from Firestore when logged in
  useEffect(() => {
    if (currentUser) {
      fetchUserCommandsFromFirestore().then((cloudCmds) => {
        if (cloudCmds.length > 0) {
          setCustomCommands(prev => {
            const map = new Map<string, SlashCommand>();
            prev.forEach(c => map.set(c.commandId, c));
            cloudCmds.forEach(c => map.set(c.commandId, c));
            const merged = Array.from(map.values());
            saveLocalCustomCommands(merged);
            return merged;
          });
        }
      });
    }
  }, [currentUser]);

  // Combine seed commands and custom commands with live usage counts & favorite flags
  const allCommands = useMemo(() => {
    const favSet = new Set(favoriteIds);
    const combined = [...customCommands, ...ALL_SEED_COMMANDS];
    
    return combined.map(cmd => {
      const extraCount = usageCounts[cmd.commandId] || 0;
      return {
        ...cmd,
        usageCount: (cmd.usageCount || 0) + extraCount,
        isFavorite: favSet.has(cmd.commandId),
      };
    });
  }, [customCommands, favoriteIds, usageCounts]);

  // Filtered & sorted commands
  const filteredCommands = useMemo(() => {
    return allCommands.filter(cmd => {
      const matchesCategory = selectedCategory === 'all' || cmd.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inName = cmd.name.toLowerCase().includes(q);
      const inDesc = cmd.description.toLowerCase().includes(q);
      const inCat = cmd.category.toLowerCase().includes(q);
      const inRole = cmd.role?.toLowerCase().includes(q);
      const inTags = cmd.tags?.some(t => t.toLowerCase().includes(q));

      return inName || inDesc || inCat || inRole || inTags;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return b.usageCount - a.usageCount;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'az') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [allCommands, selectedCategory, searchQuery, sortBy]);

  // Favorite list
  const favoriteCommands = useMemo(() => {
    return allCommands.filter(c => c.isFavorite);
  }, [allCommands]);

  // Recently used list
  const recentCommands = useMemo(() => {
    const list: SlashCommand[] = [];
    const map = new Map<string, SlashCommand>();
    allCommands.forEach(c => map.set(c.commandId, c));
    recentIds.forEach(id => {
      const found = map.get(id);
      if (found) list.push(found);
    });
    return list;
  }, [allCommands, recentIds]);

  // Toggle Favorite
  const toggleFavorite = useCallback((commandId: string) => {
    setFavoriteIds(prev => {
      const exists = prev.includes(commandId);
      const next = exists ? prev.filter(id => id !== commandId) : [commandId, ...prev];
      saveLocalFavoriteIds(next);
      showToast(
        exists ? 'info' : 'success', 
        exists ? 'Dihapus dari Favorit' : 'Ditambahkan ke Favorit',
        exists ? 'Command telah dikeluarkan dari koleksi favorit.' : 'Command tersimpan rapi di daftar favorit Anda.'
      );
      return next;
    });
  }, [showToast]);

  // Copy Command with 1-click & usage increment
  const copyCommand = useCallback((cmd: SlashCommand, silent = false) => {
    const textToCopy = formatForDirectPrompt(cmd);
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Micro-confetti burst
      try {
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#2563EB', '#06B6D4', '#8B5CF6'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        // Safe fallback
      }

      // Increment usage count
      setUsageCounts(prev => {
        const next = { ...prev, [cmd.commandId]: (prev[cmd.commandId] || 0) + 1 };
        saveLocalUsageCounts(next);
        return next;
      });

      // Update recently used
      setRecentIds(prev => {
        const filtered = prev.filter(id => id !== cmd.commandId);
        const next = [cmd.commandId, ...filtered].slice(0, 10);
        saveLocalRecentIds(next);
        return next;
      });

      if (!silent) {
        showToast('copied', 'Command Berhasil Disalin! ✨', `${cmd.name} siap di-paste langsung ke ChatGPT.`);
      }
    }).catch(err => {
      console.error('Copy failed:', err);
      showToast('error', 'Gagal Menyalin', 'Izin clipboard ditolak oleh browser.');
    });
  }, [showToast]);

  // Save new or updated command
  const saveCustomCommand = useCallback(async (cmd: SlashCommand) => {
    setCustomCommands(prev => {
      const idx = prev.findIndex(c => c.commandId === cmd.commandId);
      let next: SlashCommand[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = { ...cmd, updatedAt: new Date().toISOString() };
      } else {
        next = [{ ...cmd, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
      }
      saveLocalCustomCommands(next);
      return next;
    });

    if (currentUser) {
      await syncCommandToFirestore(cmd);
    }

    showToast('success', 'Command Disimpan! 🎉', `Command ${cmd.name} siap digunakan kapan saja.`);
  }, [currentUser, showToast]);

  // Delete custom command
  const deleteCustomCommand = useCallback(async (commandId: string) => {
    setCustomCommands(prev => {
      const next = prev.filter(c => c.commandId !== commandId);
      saveLocalCustomCommands(next);
      return next;
    });

    setFavoriteIds(prev => {
      const next = prev.filter(id => id !== commandId);
      saveLocalFavoriteIds(next);
      return next;
    });

    if (currentUser) {
      await deleteCommandFromFirestore(commandId);
    }

    showToast('info', 'Command Dihapus', 'Command pribadi Anda telah dihapus.');
  }, [currentUser, showToast]);

  // Import batch commands
  const importCommands = useCallback((imported: SlashCommand[]) => {
    setCustomCommands(prev => {
      const map = new Map<string, SlashCommand>();
      prev.forEach(c => map.set(c.commandId, c));
      imported.forEach(c => map.set(c.commandId, c));
      const next = Array.from(map.values());
      saveLocalCustomCommands(next);
      return next;
    });
    showToast('success', 'Import Berhasil!', `${imported.length} command berhasil ditambahkan ke koleksi.`);
  }, [showToast]);

  return {
    allCommands,
    filteredCommands,
    favoriteCommands,
    recentCommands,
    customCommands,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    toggleFavorite,
    copyCommand,
    saveCustomCommand,
    deleteCustomCommand,
    importCommands,
  };
}
