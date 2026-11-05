import { SlashCommand } from '../types/command';
import { db, collection, getDocs, doc, setDoc, deleteDoc, handleFirestoreError, OperationType, auth } from './firebase';

const STORAGE_KEYS = {
  CUSTOM_COMMANDS: 'hd_custom_commands_v1',
  FAVORITES: 'hd_favorites_v1',
  RECENT: 'hd_recent_v1',
  USAGE_COUNTS: 'hd_usage_counts_v1',
};

export function getLocalCustomCommands(): SlashCommand[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_COMMANDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalCustomCommands(cmds: SlashCommand[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_COMMANDS, JSON.stringify(cmds));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getLocalFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalFavoriteIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save favorites to localStorage:', e);
  }
}

export function getLocalRecentIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalRecentIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save recent to localStorage:', e);
  }
}

export function getLocalUsageCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USAGE_COUNTS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveLocalUsageCounts(counts: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USAGE_COUNTS, JSON.stringify(counts));
  } catch (e) {
    console.error('Failed to save usage counts to localStorage:', e);
  }
}

// Sync custom command to Firestore if user is authenticated
export async function syncCommandToFirestore(cmd: SlashCommand): Promise<void> {
  if (!auth.currentUser) return;
  const path = `commands/${cmd.commandId}`;
  try {
    const cmdRef = doc(db, 'commands', cmd.commandId);
    await setDoc(cmdRef, {
      ...cmd,
      userId: auth.currentUser.uid,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete custom command from Firestore
export async function deleteCommandFromFirestore(commandId: string): Promise<void> {
  if (!auth.currentUser) return;
  const path = `commands/${commandId}`;
  try {
    const cmdRef = doc(db, 'commands', commandId);
    await deleteDoc(cmdRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch user custom commands from Firestore
export async function fetchUserCommandsFromFirestore(): Promise<SlashCommand[]> {
  if (!auth.currentUser) return [];
  const path = 'commands';
  try {
    const snapshot = await getDocs(collection(db, 'commands'));
    const list: SlashCommand[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as SlashCommand;
      if (data.userId === auth.currentUser?.uid) {
        list.push(data);
      }
    });
    return list;
  } catch (error) {
    console.warn('Could not fetch from Firestore, falling back to local storage:', error);
    return [];
  }
}
