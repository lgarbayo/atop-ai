import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DocumentSearchService } from '../../../../core/services/document-search.service';
import { RootDirectoryService } from '../../../../core/services/root-directory.service';
import { SearchHistoryService } from '../../../../core/services/search-history.service';
import {
  SearchMode,
  DocumentType,
  FilterChip,
  SearchRequest,
} from '../../../../core/models/search-request.model';
import {
  SearchResult,
  SearchResponse,
} from '../../../../core/models/search-response.model';

const DEFAULT_CHIPS: FilterChip[] = [
  { label: 'PDFs',          value: 'pdf',         iconName: 'document-text-outline' },
  { label: 'Contratos',     value: 'contract',    iconName: 'ribbon-outline'        },
  { label: 'Código',        value: 'code_snippet',iconName: 'code-slash-outline'    },
  { label: 'Facturas',      value: 'invoice',     iconName: 'receipt-outline'       },
  { label: 'Propuestas',    value: 'proposal',    iconName: 'bulb-outline'          },
];

@Component({
  selector: 'app-search-shell',
  templateUrl: './search-shell.component.html',
  styleUrls: ['./search-shell.component.scss'],
  standalone: false,
})
export class SearchShellComponent implements OnInit, OnDestroy {
  query = '';
  activeMode: SearchMode = 'direct';
  activeFilters: DocumentType[] = [];
  results: SearchResult[] = [];
  totalResults = 0;
  hasSearched = false;
  showDirectoryPicker = false;

  readonly chips: FilterChip[] = DEFAULT_CHIPS;
  readonly isLoading$: Observable<boolean>;
  readonly error$: Observable<string | null>;
  readonly rootDirName$: Observable<string | null>;
  readonly history$: Observable<string[]>;

  private readonly _subs = new Subscription();

  constructor(
    private readonly searchService: DocumentSearchService,
    private readonly rootDirService: RootDirectoryService,
    private readonly historyService: SearchHistoryService,
  ) {
    this.isLoading$  = searchService.isLoading$;
    this.error$      = searchService.error$;
    this.rootDirName$ = rootDirService.rootDirName$;
    this.history$    = historyService.history$;
  }

  ngOnInit(): void {
    // Restore persisted directory; show picker if nothing is stored
    this.rootDirService.loadStoredDirectory().then(() => {
      const sub = this.rootDirService.rootDir$.subscribe(handle => {
        this.showDirectoryPicker = handle === null;
      });
      this._subs.add(sub);
    });
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  // ── Search ───────────────────────────────────────────────────────

  onQueryChange(q: string): void {
    this.query = q;
  }

  onModeChange(mode: SearchMode): void {
    this.activeMode = mode;
  }

  onFilterToggle(type: DocumentType): void {
    const idx = this.activeFilters.indexOf(type);
    this.activeFilters =
      idx > -1
        ? this.activeFilters.filter((f) => f !== type)
        : [...this.activeFilters, type];
  }

  onSearchSubmit(query: string): void {
    this.historyService.addSearch(query);

    const request: SearchRequest = {
      query,
      mode: this.activeMode,
      filters: { documentTypes: this.activeFilters },
      page: 1,
      pageSize: 10,
    };

    this.searchService.search(request).subscribe({
      next: (response: SearchResponse) => {
        this.results = response.results;
        this.totalResults = response.total;
        this.hasSearched = true;
      },
      error: () => {
        this.hasSearched = true;
      },
    });
  }

  onCardClick(documentId: string): void {
    console.log('[SearchShell] Document selected:', documentId);
  }

  // ── Recent searches ──────────────────────────────────────────────

  onSelectFromHistory(query: string): void {
    this.query = query;
    this.onSearchSubmit(query);
  }

  onRemoveFromHistory(query: string): void {
    this.historyService.removeSearch(query);
  }

  onClearHistory(): void {
    this.historyService.clearHistory();
  }

  // ── Directory management ─────────────────────────────────────────

  onPickDirectory(): void {
    this.rootDirService.pickDirectory();
  }
}
