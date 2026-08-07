import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ExportColumn } from '@core/models/export-profile.model';
import { ExternalIntegration } from '@core/models/external-integration.model';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, arrowForwardOutline, cloudUploadOutline, closeOutline, downloadOutline, settingsOutline } from 'ionicons/icons';
import {
  ExportConfigColumnHeaderUpdate,
  ExportConfigColumnMove,
  ExportConfigColumnToggle,
  FormsExportColumnsStepComponent
} from '../forms-export-columns-step/forms-export-columns-step.component';
import {
  FormsIntegrationsStepComponent,
  GoogleSheetsCreateFormInputChange,
  GoogleSheetsCreateFormState,
  IntegrationFormInputChange,
  IntegrationFormState
} from '../forms-integrations-step/forms-integrations-step.component';

export type ExportWizardStep = 'columns' | 'destination' | 'sheets';

@Component({
  selector: 'app-forms-export-wizard-modal',
  templateUrl: './forms-export-wizard-modal.component.html',
  styleUrls: ['./forms-export-wizard-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, TranslatePipe, FormsExportColumnsStepComponent, FormsIntegrationsStepComponent]
})
export class FormsExportWizardModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly step = input.required<ExportWizardStep>();
  readonly formName = input<string>('');

  // Step 1 — columns
  readonly columnsLoading = input<boolean>(false);
  readonly columnsSaving = input<boolean>(false);
  readonly editableColumns = input<ExportColumn[]>([]);

  // Step 3 — Google Sheets integrations
  readonly integrationsLoading = input<boolean>(false);
  readonly integrationsSaving = input<boolean>(false);
  readonly creatingSheet = input<boolean>(false);
  readonly testingId = input<number | null>(null);
  readonly syncingId = input<number | null>(null);
  readonly integrations = input<ExternalIntegration[]>([]);
  readonly integrationForm = input<IntegrationFormState>({ id: null, name: '', spreadsheetId: '', sheetName: '', isEnabled: true });
  readonly googleSheetsCreateForm = input<GoogleSheetsCreateFormState>({ name: '', sheetName: '', shareWithEmail: '' });

  readonly didDismiss = output<void>();
  readonly back = output<void>();
  readonly next = output<void>();
  readonly chooseSheets = output<void>();
  readonly chooseCsv = output<void>();

  readonly toggleExportColumn = output<ExportConfigColumnToggle>();
  readonly updateExportColumnHeader = output<ExportConfigColumnHeaderUpdate>();
  readonly moveExportColumn = output<ExportConfigColumnMove>();
  readonly toggleAllColumns = output<boolean>();

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

  readonly headerIcon = computed(() => this.step() === 'sheets' ? 'cloud-upload-outline' : 'settings-outline');

  readonly headerTitleKey = computed(() => {
    switch (this.step()) {
      case 'destination': return 'admin.forms.exportWizard.destinationTitle';
      case 'sheets':      return 'admin.forms.integrations.title';
      default:            return 'admin.forms.exportConfig.title';
    }
  });

  constructor() {
    addIcons({ arrowBackOutline, arrowForwardOutline, cloudUploadOutline, closeOutline, downloadOutline, settingsOutline });
  }

  close(): void {
    this.didDismiss.emit();
  }
}
