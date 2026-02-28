import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const DB_NAME = 'meiga-search-db';
const DB_VERSION = 1;
const STORE_NAME = 'root-dir';
const DIR_KEY = 'rootDirectory';

@Injectable({ providedIn: 'root' })
export class RootDirectoryService {
  readonly rootDir$ = new BehaviorSubject<FileSystemDirectoryHandle | null>(null);
  readonly rootDirName$ = this.rootDir$.pipe(map(h => h?.name ?? null));

  /** Call on app init. Restores handle from IndexedDB if permission already granted. */
  async loadStoredDirectory(): Promise<void> {
    try {
      const handle = await this._dbGet<FileSystemDirectoryHandle>(DIR_KEY);
      if (!handle) return;

      const perm = await (handle as any).queryPermission({ mode: 'read' });
      if (perm === 'granted') {
        this.rootDir$.next(handle);
      }
      // 'prompt' → user must re-confirm on next interaction; leave as null
    } catch {
      this.rootDir$.next(null);
    }
  }

  /** Opens the native directory picker. Returns true on success. */
  async pickDirectory(): Promise<boolean> {
    try {
      // The File System Access API is not yet in TypeScript's lib.dom.d.ts for older TS targets
      const handle: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker({ mode: 'read' });
      this.rootDir$.next(handle);
      await this._dbSet(DIR_KEY, handle);
      return true;
    } catch {
      // User cancelled or API unavailable
      return false;
    }
  }

  /** Clears the stored directory and resets state. */
  async clearDirectory(): Promise<void> {
    this.rootDir$.next(null);
    try {
      await this._dbDelete(DIR_KEY);
    } catch { /* ignore */ }
  }

  // ──────────────────────────────────────────────────────────────── IndexedDB helpers ──

  private _openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  private async _dbGet<T>(key: string): Promise<T | undefined> {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result as T);
      req.onerror   = () => reject(req.error);
    });
  }

  private async _dbSet(key: string, value: unknown): Promise<void> {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(value, key);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  private async _dbDelete(key: string): Promise<void> {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(key);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }
}
