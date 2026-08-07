import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ExportColumn } from '@core/models/export-profile.model';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronUpOutline, closeOutline, searchOutline } from 'ionicons/icons';

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

interface IndexedColumn {
  column: ExportColumn;
  index: number;
}

@Component({
  selector: 'app-forms-export-columns-step',
  templateUrl: './forms-export-columns-step.component.html',
  styleUrls: ['./forms-export-columns-step.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, TranslatePipe]
})
export class FormsExportColumnsStepComponent {
  readonly loading = input<boolean>(false);
  readonly editableColumns = input<ExportColumn[]>([]);

  readonly toggleExportColumn = output<ExportConfigColumnToggle>();
  readonly updateExportColumnHeader = output<ExportConfigColumnHeaderUpdate>();
  readonly moveExportColumn = output<ExportConfigColumnMove>();
  readonly toggleAllColumns = output<boolean>();

  readonly searchValue = signal<string>('');

  /** Headers of the enabled columns, in order: what the CSV will actually look like. */
  readonly previewHeaders = computed(() =>
    this.editableColumns().filter(column => column.isEnabled).map(column => column.header)
  );

  readonly allEnabled = computed(() => {
    const columns = this.editableColumns();
    return columns.length > 0 && columns.every(column => column.isEnabled);
  });

  /**
   * Columns paired with their position in the full list. The search filters this list,
   * but every event still carries the original index so reordering stays correct.
   */
  readonly visibleColumns = computed<IndexedColumn[]>(() => {
    const search = this.searchValue().trim().toLowerCase();
    const indexed = this.editableColumns().map((column, index) => ({ column, index }));
    if (!search) return indexed;
    return indexed.filter(({ column }) =>
      column.header.toLowerCase().includes(search) || column.sourceKey.toLowerCase().includes(search)
    );
  });

  readonly lastIndex = computed(() => this.editableColumns().length - 1);

  constructor() {
    addIcons({ chevronDownOutline, chevronUpOutline, closeOutline, searchOutline });
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

  onToggleAll(isEnabled: boolean): void {
    this.toggleAllColumns.emit(isEnabled);
  }

  clearSearch(): void {
    this.searchValue.set('');
  }
}
