import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchModeToggleComponent } from './components/search-mode-toggle/search-mode-toggle.component';
import { FilterChipsComponent } from './components/filter-chips/filter-chips.component';
import { RootDirectoryPickerComponent } from './components/root-directory-picker/root-directory-picker.component';
import { RecentSearchesComponent } from './components/recent-searches/recent-searches.component';
import { FileManagerMenuComponent } from './components/file-manager-menu/file-manager-menu.component';

const COMPONENTS = [
  SearchBarComponent,
  SearchModeToggleComponent,
  FilterChipsComponent,
  RootDirectoryPickerComponent,
  RecentSearchesComponent,
  FileManagerMenuComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, IonicModule],
  exports: [...COMPONENTS],
})
export class SharedModule {}
