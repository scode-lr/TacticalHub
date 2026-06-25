import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ExportColumn, ExportProfile } from '@core/models/export-profile.model';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronUpOutline, closeOutline, saveOutline, settingsOutline } from 'ionicons/icons';

export interface ExportConfigColumnHeaderUpdate {
  index: number;
  header: string;
}

export interface ExportConfigColumnToggle {
  index: number;
  isEnabled: boolean;
}

export interface ExportConfigColumnMove {
  index: number;
  direction: -1 | 1;
}

@Component({
  selector: 'app-forms-export-config-modal',
  templateUrl: './forms-export-config-modal.component.html',
  styleUrls: ['./forms-export-config-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonModal, TranslatePipe]
})
export class FormsExportConfigModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly loading = input<boolean>(false);
  readonly saving = input<boolean>(false);
  readonly exportProfile = input<ExportProfile | null>(null);
  readonly editableColumns = input<ExportColumn[]>([]);

  readonly didDismiss = output<void>();
  readonly toggleExportColumn = output<ExportConfigColumnToggle>();
  readonly updateExportColumnHeader = output<ExportConfigColumnHeaderUpdate>();
  readonly moveExportColumn = output<ExportConfigColumnMove>();
  readonly save = output<void>();

  constructor() {
    addIcons({ chevronDownOutline, chevronUpOutline, closeOutline, saveOutline, settingsOutline });
  }

  close(): void {
    this.didDismiss.emit();
  }

  onToggle(index: number, isEnabled: boolean): void {
    this.toggleExportColumn.emit({ index, isEnabled });
  }

  onUpdateHeader(index: number, header: string): void {
    this.updateExportColumnHeader.emit({ index, header });
  }

  onMove(index: number, direction: -1 | 1): void {
    this.moveExportColumn.emit({ index, direction });
  }

  onSave(): void {
    this.save.emit();
  }
}
