import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ExternalIntegration, GoogleSheetsConfiguration } from '@core/models/external-integration.model';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkCircleOutline, closeOutline, cloudUploadOutline, openOutline, refreshOutline, saveOutline, settingsOutline, trashOutline } from 'ionicons/icons';
import { TagModule } from 'primeng/tag';

export interface IntegrationFormState {
  id: number | null;
  name: string;
  spreadsheetId: string;
  sheetName: string;
  isEnabled: boolean;
}

export interface GoogleSheetsCreateFormState {
  name: string;
  sheetName: string;
  shareWithEmail: string;
}

export interface IntegrationFormInputChange {
  key: keyof IntegrationFormState;
  value: string | boolean;
}

export interface GoogleSheetsCreateFormInputChange {
  key: keyof GoogleSheetsCreateFormState;
  value: string;
}

@Component({
  selector: 'app-forms-integrations-modal',
  templateUrl: './forms-integrations-modal.component.html',
  styleUrls: ['./forms-integrations-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonModal, TagModule, TranslatePipe]
})
export class FormsIntegrationsModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly loading = input<boolean>(false);
  readonly saving = input<boolean>(false);
  readonly creatingSheet = input<boolean>(false);
  readonly testingId = input<number | null>(null);
  readonly syncingId = input<number | null>(null);
  readonly integrations = input<ExternalIntegration[]>([]);
  readonly integrationForm = input<IntegrationFormState>({ id: null, name: '', spreadsheetId: '', sheetName: '', isEnabled: true });
  readonly googleSheetsCreateForm = input<GoogleSheetsCreateFormState>({ name: '', sheetName: '', shareWithEmail: '' });

  readonly didDismiss = output<void>();
  readonly editIntegration = output<ExternalIntegration>();
  readonly newIntegration = output<void>();
  readonly updateIntegrationForm = output<IntegrationFormInputChange>();
  readonly updateGoogleSheetsCreateForm = output<GoogleSheetsCreateFormInputChange>();
  readonly createGoogleSheetsIntegration = output<void>();
  readonly saveIntegration = output<void>();
  readonly testIntegration = output<ExternalIntegration>();
  readonly syncIntegration = output<ExternalIntegration>();
  readonly deleteIntegration = output<ExternalIntegration>();
  readonly openIntegrationSpreadsheet = output<ExternalIntegration>();

  constructor() {
    addIcons({ addOutline, checkmarkCircleOutline, closeOutline, cloudUploadOutline, openOutline, refreshOutline, saveOutline, settingsOutline, trashOutline });
  }

  close(): void {
    this.didDismiss.emit();
  }

  onUpdateIntegrationForm(key: keyof IntegrationFormState, value: string | boolean): void {
    this.updateIntegrationForm.emit({ key, value });
  }

  onUpdateGoogleSheetsCreateForm(key: keyof GoogleSheetsCreateFormState, value: string): void {
    this.updateGoogleSheetsCreateForm.emit({ key, value });
  }

  onCreateGoogleSheetsIntegration(): void {
    this.createGoogleSheetsIntegration.emit();
  }

  onNewIntegration(): void {
    this.newIntegration.emit();
  }

  onSaveIntegration(): void {
    this.saveIntegration.emit();
  }

  onEditIntegration(integration: ExternalIntegration): void {
    this.editIntegration.emit(integration);
  }

  onTestIntegration(integration: ExternalIntegration): void {
    this.testIntegration.emit(integration);
  }

  onSyncIntegration(integration: ExternalIntegration): void {
    this.syncIntegration.emit(integration);
  }

  onDeleteIntegration(integration: ExternalIntegration): void {
    this.deleteIntegration.emit(integration);
  }

  onOpenIntegrationSpreadsheet(integration: ExternalIntegration): void {
    this.openIntegrationSpreadsheet.emit(integration);
  }

  getGoogleSheetsConfig(integration: ExternalIntegration): GoogleSheetsConfiguration {
    try {
      const parsed = JSON.parse(integration.configurationJson) as Partial<GoogleSheetsConfiguration>;
      return {
        spreadsheetId: parsed.spreadsheetId ?? '',
        sheetName: parsed.sheetName ?? ''
      };
    } catch {
      return { spreadsheetId: '', sheetName: '' };
    }
  }
}
