import { Component, OnInit } from '@angular/core';
import { RootDirectoryService } from '../../../core/services/root-directory.service';

@Component({
  selector: 'app-root-directory-picker',
  templateUrl: './root-directory-picker.component.html',
  styleUrls: ['./root-directory-picker.component.scss'],
  standalone: false,
})
export class RootDirectoryPickerComponent implements OnInit {
  picking = false;
  apiUnavailable = false;

  constructor(private readonly rootDirService: RootDirectoryService) {}

  ngOnInit(): void {
    this.apiUnavailable = typeof (window as any).showDirectoryPicker !== 'function';
  }

  async onPick(): Promise<void> {
    if (this.apiUnavailable) return;
    this.picking = true;
    await this.rootDirService.pickDirectory();
    this.picking = false;
  }
}
