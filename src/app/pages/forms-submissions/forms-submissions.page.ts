import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { FormService } from '@core/services/form.service';
import { ClubService } from '@core/services/club.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { NotificationsService } from '@core/services/notifications.service';
import { NavigationService } from '@services/navigation.service';
import { FormDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
import { ExportColumn, ExportProfile, SaveExportProfileRequest } from '@core/models/export-profile.model';
import { CreateGoogleSheetsIntegrationRequest, ExternalIntegration, ExternalIntegrationDestinationType, ExternalIntegrationProvider, GoogleSheetsConfiguration, SaveExternalIntegrationRequest } from '@core/models/external-integration.model';
import { AppStatus } from '@core/models/app-status.model';
import { FormAction } from '@core/models/form-action.enum';
import { Table, TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline, funnelOutline, documentTextOutline, closeOutline, settingsOutline, saveOutline, chevronUpOutline, chevronDownOutline, chevronForwardOutline, chevronBackOutline, cloudUploadOutline, addOutline, refreshOutline, checkmarkCircleOutline, trashOutline, openOutline, bodyOutline, peopleOutline } from 'ionicons/icons';
import { ActionRequestsComponent } from '@components/action-requests/action-requests.component';
import { ExportWizardStep, FormsExportWizardModalComponent } from './components/forms-export-wizard-modal/forms-export-wizard-modal.component';
import { GoogleSheetsCreateFormState, IntegrationFormState } from './components/forms-integrations-step/forms-integrations-step.component';

@Component({
  selector: 'app-forms-submissions',
  templateUrl: './forms-submissions.page.html',
  styleUrls: ['./forms-submissions.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TableModule, TagModule, InputTextModule, IconFieldModule, InputIconModule, BreadcrumbModule, PaginatorModule, IonIcon, IonToast, ActionRequestsComponent, FormsExportWizardModalComponent]
})
export class FormsSubmissionsPage implements OnInit {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly translationService = inject(TranslationService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly navigationService = inject(NavigationService);

  constructor() {
    addIcons({ downloadOutline, searchOutline, funnelOutline, documentTextOutline, closeOutline, settingsOutline, saveOutline, chevronUpOutline, chevronDownOutline, chevronForwardOutline, chevronBackOutline, cloudUploadOutline, addOutline, refreshOutline, checkmarkCircleOutline, trashOutline, openOutline, bodyOutline, peopleOutline });
  }

  readonly forms = signal<FormDetail[]>([]);
  readonly loading = signal<boolean>(true);
  readonly formsLimit = signal<number>(10);
  readonly formsOffset = signal<number>(0);
  readonly hasMoreForms = signal<boolean>(false);
  readonly viewState = signal<'list' | 'detail'>('list');
  readonly selectedFormId = signal<number | null>(null);
  readonly submissions = signal<FormSubmission[]>([]);
  readonly submissionsLoading = signal<boolean>(false);
  readonly pageSize = signal<number>(10);
  readonly currentPage = signal<number>(1);
  readonly totalSubmissions = signal<number>(0);
  readonly currentSort = signal<string | undefined>(undefined);

  readonly ActiveStatus = AppStatus.Active;

  readonly toastVisible = signal<boolean>(false);
  readonly toastMessage = signal<string>('');
  readonly toastColor = signal<'success' | 'danger'>('danger');

  readonly isExportOpen = signal<boolean>(false);
  readonly exportStep = signal<ExportWizardStep>('columns');
  readonly exportConfigLoading = signal<boolean>(false);
  readonly exportConfigSaving = signal<boolean>(false);
  readonly exportProfile = signal<ExportProfile | null>(null);
  readonly editableColumns = signal<ExportColumn[]>([]);

  readonly integrationsLoading = signal<boolean>(false);
  readonly integrationsSaving = signal<boolean>(false);
  readonly integrationsCreatingSheet = signal<boolean>(false);
  readonly integrationsTestingId = signal<number | null>(null);
  readonly integrationsSyncingId = signal<number | null>(null);
  readonly integrations = signal<ExternalIntegration[]>([]);
  readonly integrationForm = signal<IntegrationFormState>(this.createEmptyIntegrationForm());
  readonly googleSheetsCreateForm = signal<GoogleSheetsCreateFormState>(this.createEmptyGoogleSheetsCreateForm());

  searchValue = '';
  submissionsSearchValue = '';

  readonly selectedForm = computed(() => {
    const formId = this.selectedFormId();
    return formId ? this.forms().find(f => f.id === formId) : null;
  });

  readonly breadcrumbItems = computed<MenuItem[]>(() => [
    { label: this.translationService.instant('admin.forms.allForms'), command: () => this.backToList() },
    { label: this.selectedForm()?.name ?? '' }
  ]);

  async ngOnInit(): Promise<void> {
    // The pending-approval block still reads from the notifications feed; the definitive
    // data source (dedicated endpoint vs. /notifications) is still to be decided.
    if (this.notificationsService.getNotifications().length === 0) {
      void this.notificationsService.loadNotifications();
    }

    const saved = this.formSubmissionsService.savedPageState;
    if (saved) {
      this.formSubmissionsService.savedPageState = null;
      this.viewState.set(saved.viewState);
      this.selectedFormId.set(saved.selectedFormId);
      this.forms.set(saved.forms);
      this.formsLimit.set(saved.formsLimit);
      this.formsOffset.set(saved.formsOffset);
      this.searchValue = saved.searchValue;
      this.submissions.set(saved.submissions);
      this.totalSubmissions.set(saved.totalSubmissions);
      this.pageSize.set(saved.pageSize);
      this.currentPage.set(saved.currentPage);
      this.currentSort.set(saved.currentSort);
      this.loading.set(false);
      this.submissionsLoading.set(false);
      this.submissionsSearchValue = saved.submissionsSearchValue;
    } else {
      await this.loadForms();
    }
  }

  readonly formsPageNumber = computed(() => Math.floor(this.formsOffset() / this.formsLimit()) + 1);

  visibleForms(): FormDetail[] {
    const query = this.searchValue.trim().toLocaleLowerCase();
    if (!query) return this.forms();

    return this.forms().filter(form =>
      [form.name, form.action, form.status]
        .some(value => String(value ?? '').toLocaleLowerCase().includes(query))
    );
  }

  async prevFormsPage(): Promise<void> {
    if (this.formsOffset() === 0) return;
    this.formsOffset.set(Math.max(0, this.formsOffset() - this.formsLimit()));
    await this.loadForms();
  }

  async nextFormsPage(): Promise<void> {
    if (!this.hasMoreForms()) return;
    this.formsOffset.set(this.formsOffset() + this.formsLimit());
    await this.loadForms();
  }

  private async loadForms(): Promise<void> {
    this.loading.set(true);
    try {
      const clubId = this.clubService.getCurrentClubId();
      if (clubId !== null) {
        const limit = this.formsLimit();
        // GET /forms returns no total, so one extra row is requested just to
        // find out whether there is a next page.
        const result = await this.formService.getFormsByClubId(clubId, undefined, true, limit + 1, this.formsOffset());
        this.hasMoreForms.set(result.length > limit);
        this.forms.set(result.slice(0, limit));
      }
    } catch (error) {
      console.error(error);
      this.forms.set([]);
      this.hasMoreForms.set(false);
    } finally {
      this.loading.set(false);
    }
  }

  async selectForm(formId: number): Promise<void> {
    this.selectedFormId.set(formId);
    this.pageSize.set(10);
    this.currentPage.set(1);
    this.currentSort.set(undefined);
    this.submissionsSearchValue = '';
    this.viewState.set('detail');
    const form = this.forms().find(f => f.id === formId);
    if (!form) return;
    this.totalSubmissions.set(form.submissionsCount ?? 0);
  }

  async onLazyLoad(event: TableLazyLoadEvent): Promise<void> {
    const formId = this.selectedFormId();
    if (formId === null) return;
    const rows = event.rows ?? this.pageSize();
    const rowsChanged = rows !== this.pageSize();
    this.pageSize.set(rows);
    this.currentPage.set(rowsChanged ? 1 : Math.floor((event.first ?? 0) / rows) + 1);
    if (event.sortField) {
      const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
      const dir = event.sortOrder === 1 ? 'asc' : 'desc';
      this.currentSort.set(`${field};${dir}`);
    }
    await this.loadSubmissions(formId);
  }

  async onSubmissionsSearch(): Promise<void> {
    const formId = this.selectedFormId();
    if (formId === null) return;
    this.currentPage.set(1);
    await this.loadSubmissions(formId);
  }

  async clearSubmissionsFilter(dt?: Table): Promise<void> {
    this.submissionsSearchValue = '';
    dt?.reset();
    const formId = this.selectedFormId();
    if (formId === null) return;
    this.currentPage.set(1);
    await this.loadSubmissions(formId);
  }

  private async loadSubmissions(formId: number): Promise<void> {
    this.submissionsLoading.set(true);
    try {
      const submissionsPage = await this.formSubmissionsService.getSubmissions(formId, this.pageSize(), (this.currentPage() - 1) * this.pageSize(), this.submissionsSearchValue || undefined, this.currentSort());
      this.submissions.set(submissionsPage.submissions);
      this.totalSubmissions.set(submissionsPage.totalCount ?? this.totalSubmissions());
    } catch (error) {
      console.error('Error loading submissions:', error);
      this.submissions.set([]);
      this.submissionsLoading.set(false);
    } finally {
      this.submissionsLoading.set(false);
    }
  }

  navigateToSubmission(submissionId: number): void {
    this.formSubmissionsService.savedPageState = {
      viewState: this.viewState(),
      selectedFormId: this.selectedFormId(),
      forms: this.forms(),
      formsLimit: this.formsLimit(),
      formsOffset: this.formsOffset(),
      searchValue: this.searchValue,
      submissions: this.submissions(),
      totalSubmissions: this.totalSubmissions(),
      pageSize: this.pageSize(),
      currentPage: this.currentPage(),
      currentSort: this.currentSort(),
      submissionsSearchValue: this.submissionsSearchValue,
    };
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms-submissions/${submissionId}`]);
  }

  // ── Export wizard ────────────────────────────────────────────────

  async openExport(): Promise<void> {
    const form = this.selectedForm();
    if (!form) return;

    this.isExportOpen.set(true);
    this.exportStep.set('columns');
    this.exportConfigLoading.set(true);
    this.exportProfile.set(null);
    this.editableColumns.set([]);

    try {
      const profile = await this.formSubmissionsService.getExportProfile(form.id);
      this.exportProfile.set(profile);
      this.editableColumns.set(profile.columns.map(column => ({ ...column })).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading export profile:', error);
      this.showToast(this.translationService.instant('admin.forms.exportConfig.loadError'), 'danger');
      this.closeExport();
    } finally {
      this.exportConfigLoading.set(false);
    }
  }

  closeExport(): void {
    this.isExportOpen.set(false);
    this.exportStep.set('columns');
    this.exportProfile.set(null);
    this.editableColumns.set([]);
    this.exportConfigLoading.set(false);
    this.exportConfigSaving.set(false);
    this.integrationsLoading.set(false);
    this.integrationsSaving.set(false);
    this.integrationsCreatingSheet.set(false);
    this.integrationsTestingId.set(null);
    this.integrationsSyncingId.set(null);
    this.integrations.set([]);
    this.integrationForm.set(this.createEmptyIntegrationForm());
    this.googleSheetsCreateForm.set(this.createEmptyGoogleSheetsCreateForm());
  }

  /** Back arrow: from the destination step to the columns, from Sheets to the destination. */
  onWizardBack(): void {
    this.exportStep.set(this.exportStep() === 'sheets' ? 'destination' : 'columns');
  }

  /** Saves the export profile and, only if it succeeds, moves on to pick a destination. */
  async goToDestination(): Promise<void> {
    if (await this.saveExportConfig()) {
      this.exportStep.set('destination');
    }
  }

  async goToSheets(): Promise<void> {
    const form = this.selectedForm();
    if (!form) return;

    this.exportStep.set('sheets');
    this.integrationsLoading.set(true);
    this.integrations.set([]);
    this.integrationForm.set(this.createEmptyIntegrationForm());
    this.googleSheetsCreateForm.set(this.createEmptyGoogleSheetsCreateForm(form.name));

    try {
      this.integrations.set(await this.formSubmissionsService.getIntegrations(form.id));
    } catch (error) {
      console.error('Error loading integrations:', error);
      this.showToast(this.translationService.instant('admin.forms.integrations.loadError'), 'danger');
      this.exportStep.set('destination');
    } finally {
      this.integrationsLoading.set(false);
    }
  }

  async downloadCsv(): Promise<void> {
    const form = this.selectedForm();
    if (!form) return;

    try {
      await this.formSubmissionsService.exportSubmissions(form.id, form.name);
      this.closeExport();
    } catch {
      this.showToast(this.translationService.instant('admin.forms.exportError'), 'danger');
    }
  }

  toggleExportColumn(index: number, isEnabled: boolean): void {
    const columns = this.editableColumns().map((column, columnIndex) => columnIndex === index ? { ...column, isEnabled } : column);
    this.editableColumns.set(columns);
  }

  toggleAllExportColumns(isEnabled: boolean): void {
    this.editableColumns.set(this.editableColumns().map(column => ({ ...column, isEnabled })));
  }

  updateExportColumnHeader(index: number, header: string): void {
    const columns = this.editableColumns().map((column, columnIndex) => columnIndex === index ? { ...column, header } : column);
    this.editableColumns.set(columns);
  }

  moveExportColumn(index: number, direction: -1 | 1): void {
    const targetIndex = index + direction;
    const columns = [...this.editableColumns()];
    if (targetIndex < 0 || targetIndex >= columns.length) return;

    [columns[index], columns[targetIndex]] = [columns[targetIndex], columns[index]];
    this.editableColumns.set(columns.map((column, columnIndex) => ({ ...column, order: columnIndex })));
  }

  /** Returns true when the profile was persisted, false when validation or the request failed. */
  private async saveExportConfig(): Promise<boolean> {
    const profile = this.exportProfile();
    if (!profile || this.exportConfigSaving()) return false;

    const columns = this.editableColumns().map((column, index) => ({ ...column, order: index }));
    if (!columns.some(column => column.isEnabled)) {
      this.showToast(this.translationService.instant('admin.forms.exportConfig.atLeastOne'), 'danger');
      return false;
    }

    if (columns.some(column => column.isEnabled && !column.header.trim())) {
      this.showToast(this.translationService.instant('admin.forms.exportConfig.headerRequired'), 'danger');
      return false;
    }

    const request: SaveExportProfileRequest = {
      name: profile.name,
      columns: columns.map(column => ({
        sourceKind: column.sourceKind,
        sourceKey: column.sourceKey,
        header: column.header.trim(),
        order: column.order,
        isEnabled: column.isEnabled,
        format: column.format ?? null
      }))
    };

    this.exportConfigSaving.set(true);
    try {
      const saved = await this.formSubmissionsService.saveExportProfile(profile.sourceId ?? profile.id!, request);
      this.exportProfile.set(saved);
      this.editableColumns.set(saved.columns.map(column => ({ ...column })).sort((a, b) => a.order - b.order));
      return true;
    } catch (error) {
      console.error('Error saving export profile:', error);
      this.showToast(this.translationService.instant('admin.forms.exportConfig.saveError'), 'danger');
      return false;
    } finally {
      this.exportConfigSaving.set(false);
    }
  }

  // ── Google Sheets integrations ───────────────────────────────────

  editIntegration(integration: ExternalIntegration): void {
    const config = this.parseGoogleSheetsConfig(integration.configurationJson);
    this.integrationForm.set({
      id: integration.id,
      name: integration.name,
      spreadsheetId: config.spreadsheetId,
      sheetName: config.sheetName,
      isEnabled: integration.isEnabled
    });
  }

  newIntegration(): void {
    this.integrationForm.set(this.createEmptyIntegrationForm());
  }

  updateIntegrationForm<K extends keyof IntegrationFormState>(key: K, value: IntegrationFormState[K]): void {
    this.integrationForm.set({ ...this.integrationForm(), [key]: value });
  }

  updateGoogleSheetsCreateForm<K extends keyof GoogleSheetsCreateFormState>(key: K, value: GoogleSheetsCreateFormState[K]): void {
    this.googleSheetsCreateForm.set({ ...this.googleSheetsCreateForm(), [key]: value });
  }

  async createGoogleSheetsIntegration(): Promise<void> {
    const form = this.selectedForm();
    const createForm = this.googleSheetsCreateForm();
    if (!form || this.integrationsCreatingSheet()) return;

    if (!createForm.name.trim() || !createForm.sheetName.trim() || !createForm.shareWithEmail.trim()) {
      this.showToast(this.translationService.instant('admin.forms.integrations.createRequired'), 'danger');
      return;
    }

    const request: CreateGoogleSheetsIntegrationRequest = {
      name: createForm.name.trim(),
      sheetName: createForm.sheetName.trim(),
      shareWithEmail: createForm.shareWithEmail.trim()
    };

    this.integrationsCreatingSheet.set(true);
    try {
      await this.formSubmissionsService.createGoogleSheetsIntegration(form.id, request);
      this.integrations.set(await this.formSubmissionsService.getIntegrations(form.id));
      this.googleSheetsCreateForm.set(this.createEmptyGoogleSheetsCreateForm(form.name));
      this.showToast(this.translationService.instant('admin.forms.integrations.createSuccess'), 'success');
    } catch (error) {
      console.error('Error creating Google Sheets integration:', error);
      this.showToast(this.translationService.instant('admin.forms.integrations.createError'), 'danger');
    } finally {
      this.integrationsCreatingSheet.set(false);
    }
  }

  async saveIntegration(): Promise<void> {
    const form = this.selectedForm();
    const profile = this.exportProfile();
    const integrationForm = this.integrationForm();
    if (!form || !profile?.id || this.integrationsSaving()) return;

    const spreadsheetId = this.extractSpreadsheetId(integrationForm.spreadsheetId);
    if (!integrationForm.name.trim() || !spreadsheetId || !integrationForm.sheetName.trim()) {
      this.showToast(this.translationService.instant('admin.forms.integrations.required'), 'danger');
      return;
    }

    const request: SaveExternalIntegrationRequest = {
      exportProfileId: profile.id,
      provider: ExternalIntegrationProvider.GoogleSheets,
      destinationType: ExternalIntegrationDestinationType.Spreadsheet,
      name: integrationForm.name.trim(),
      isEnabled: integrationForm.isEnabled,
      configurationJson: JSON.stringify({ spreadsheetId, sheetName: integrationForm.sheetName.trim() })
    };

    this.integrationsSaving.set(true);
    try {
      const saved = integrationForm.id
        ? await this.formSubmissionsService.updateIntegration(form.id, integrationForm.id, request)
        : await this.formSubmissionsService.createIntegration(form.id, request);

      const current = this.integrations();
      this.integrations.set(integrationForm.id ? current.map(item => item.id === saved.id ? saved : item) : [...current, saved]);
      this.integrationForm.set(this.createEmptyIntegrationForm());
      this.showToast(this.translationService.instant('admin.forms.integrations.saveSuccess'), 'success');
    } catch (error) {
      console.error('Error saving integration:', error);
      this.showToast(this.translationService.instant('admin.forms.integrations.saveError'), 'danger');
    } finally {
      this.integrationsSaving.set(false);
    }
  }

  async testIntegration(integration: ExternalIntegration): Promise<void> {
    const form = this.selectedForm();
    if (!form || this.integrationsTestingId()) return;

    this.integrationsTestingId.set(integration.id);
    try {
      const result = await this.formSubmissionsService.testIntegration(form.id, integration.id);
      this.showToast(result.message || this.translationService.instant('admin.forms.integrations.testSuccess'), 'success');
    } catch (error) {
      console.error('Error testing integration:', error);
      this.showToast(this.translationService.instant('admin.forms.integrations.testError'), 'danger');
    } finally {
      this.integrationsTestingId.set(null);
    }
  }

  async syncIntegration(integration: ExternalIntegration): Promise<void> {
    const form = this.selectedForm();
    if (!form || this.integrationsSyncingId()) return;

    this.integrationsSyncingId.set(integration.id);
    try {
      const result = await this.formSubmissionsService.syncPendingIntegration(form.id, integration.id);
      this.showToast(this.translationService.instant('admin.forms.integrations.syncSuccess', { synced: result.synced, failed: result.failed }), result.failed > 0 ? 'danger' : 'success');
      this.integrations.set(await this.formSubmissionsService.getIntegrations(form.id));
    } catch (error) {
      console.error('Error syncing integration:', error);
      this.showToast(this.translationService.instant('admin.forms.integrations.syncError'), 'danger');
    } finally {
      this.integrationsSyncingId.set(null);
    }
  }

  async deleteIntegration(integration: ExternalIntegration): Promise<void> {
    const form = this.selectedForm();
    if (!form) return;

    try {
      await this.formSubmissionsService.deleteIntegration(form.id, integration.id);
      this.integrations.set(this.integrations().filter(item => item.id !== integration.id));
      if (this.integrationForm().id === integration.id) this.newIntegration();
      this.showToast(this.translationService.instant('admin.forms.integrations.deleteSuccess'), 'success');
    } catch (error) {
      console.error('Error deleting integration:', error);
      this.showToast(this.translationService.instant('admin.forms.integrations.deleteError'), 'danger');
    }
  }

  getGoogleSheetsConfig(integration: ExternalIntegration): GoogleSheetsConfiguration {
    return this.parseGoogleSheetsConfig(integration.configurationJson);
  }

  openIntegrationSpreadsheet(integration: ExternalIntegration): void {
    const spreadsheetId = this.getGoogleSheetsConfig(integration).spreadsheetId;
    if (!spreadsheetId) return;

    window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank', 'noopener,noreferrer');
  }

  private createEmptyIntegrationForm(): IntegrationFormState {
    return {
      id: null,
      name: 'Google Sheets',
      spreadsheetId: '',
      sheetName: 'Submissions',
      isEnabled: true
    };
  }

  private createEmptyGoogleSheetsCreateForm(formName = ''): GoogleSheetsCreateFormState {
    return {
      name: formName ? `${formName} submissions` : 'Google Sheets',
      sheetName: 'Submissions',
      shareWithEmail: ''
    };
  }

  private parseGoogleSheetsConfig(configurationJson: string): GoogleSheetsConfiguration {
    try {
      const parsed = JSON.parse(configurationJson) as Partial<GoogleSheetsConfiguration>;
      return {
        spreadsheetId: parsed.spreadsheetId ?? '',
        sheetName: parsed.sheetName ?? ''
      };
    } catch {
      return { spreadsheetId: '', sheetName: '' };
    }
  }

  private extractSpreadsheetId(value: string): string {
    const trimmed = value.trim();
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match?.[1] ?? trimmed;
  }

  private showToast(message: string, color: 'success' | 'danger' = 'danger'): void {
    this.toastMessage.set(message);
    this.toastColor.set(color);
    this.toastVisible.set(true);
  }

  onToastDismiss(): void {
    this.toastVisible.set(false);
  }

  backToList(): void {
    this.viewState.set('list');
    this.selectedFormId.set(null);
    this.submissions.set([]);
    this.totalSubmissions.set(0);
  }

  clear(): void {
    this.searchValue = '';
  }

  /**
   * Keep the mobile paginator on the same signal state as the desktop table.
   */
  async onMobilePage(event: PaginatorState): Promise<void> {
    const formId = this.selectedFormId();
    if (formId === null) return;

    const rows = event.rows ?? this.pageSize();
    this.pageSize.set(rows);
    this.currentPage.set(Math.floor((event.first ?? 0) / rows) + 1);
    await this.loadSubmissions(formId);
  }

  formIcon(form: FormDetail): string {
    switch (form.action) {
      case FormAction.RegisterPlayer: return 'body-outline';
      case FormAction.BecomeMember:   return 'people-outline';
      default:                        return 'document-text-outline';
    }
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case AppStatus.Active: return 'success';
      case AppStatus.Pending: return 'warn';
      case AppStatus.Draft: return 'info';
      case AppStatus.Inactive: return 'danger';
      default: return undefined;
    }
  }

}
