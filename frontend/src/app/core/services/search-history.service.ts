import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'meiga_search_history';
const MAX_ENTRIES = 20;

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  readonly history$ = new BehaviorSubject<string[]>(this._load());

  addSearch(query: string): void {
    const q = query.trim();
    if (!q) return;
    const deduped = this.history$.value.filter(h => h !== q);
    const updated = [q, ...deduped].slice(0, MAX_ENTRIES);
    this._save(updated);
    this.history$.next(updated);
  }

  removeSearch(query: string): void {
    const updated = this.history$.value.filter(h => h !== query);
    this._save(updated);
    this.history$.next(updated);
  }

  clearHistory(): void {
    this._save([]);
    this.history$.next([]);
  }

  private _load(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private _save(entries: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}
