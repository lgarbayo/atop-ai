import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html',
  styleUrls: ['./recent-searches.component.scss'],
  standalone: false,
})
export class RecentSearchesComponent {
  @Input() history: string[] = [];
  @Output() selectSearch = new EventEmitter<string>();
  @Output() removeSearch = new EventEmitter<string>();
  @Output() clearAll = new EventEmitter<void>();

  onSelect(query: string): void {
    this.selectSearch.emit(query);
  }

  onRemove(query: string, event: Event): void {
    event.stopPropagation();
    this.removeSearch.emit(query);
  }

  onClearAll(): void {
    this.clearAll.emit();
  }
}
