import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-manager-menu',
  templateUrl: './file-manager-menu.component.html',
  styleUrls: ['./file-manager-menu.component.scss'],
  standalone: false,
})
export class FileManagerMenuComponent {
  @Input() rootDirName: string | null = null;
  @Output() pickDirectory = new EventEmitter<void>();

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onPickDirectory(): void {
    this.closeMenu();
    this.pickDirectory.emit();
  }
}
