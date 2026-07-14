import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { FormService } from '@core/services/form.service';
import { ClubService } from '@core/services/club.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { NavigationService } from '@services/navigation.service';
import { FormDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
import { ExportColumn, ExportProfile, ExportColumnSourceKind, SaveExportProfileRequest } from '@core/models/export-profile.model';
import { CreateGoogleSheetsIntegrationRequest, ExternalIntegration, ExternalIntegrationDestinationType, ExternalIntegrationProvider, GoogleSheetsConfiguration, SaveExternalIntegrationRequest } from '@core/models/external-integration.model';
import { AppStatus } from '@core/models/app-status.model';
import { FormAction } from '@core/models/form-action.enum';
import { Table, TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline, funnelOutline, documentTextOutline, closeOutline, settingsOutline, saveOutline, chevronUpOutline, chevronDownOutline, cloudUploadOutline, addOutline, refreshOutline, checkmarkCircleOutline, trashOutline, openOutline } from 'ionicons/icons';
import { FormsExportConfigModalComponent } from './components/forms-export-config-modal/forms-export-config-modal.component';
import { FormsIntegrationsModalComponent } from './components/forms-integrations-modal/forms-integrations-modal.component';

interface IntegrationFormState {
  id: number | null;
  name: string;
  spreadsheetId: string;
  sheetName: string;
  isEnabled: boolean;
}

interface GoogleSheetsCreateFormState {
  name: string;
  sheetName: string;
  shareWithEmail: string;
}


@Component({
  selector: 'app-forms-submissions',
  templateUrl: './forms-submissions.page.html',
  styleUrls: ['./forms-submissions.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TableModule, TagModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule, BreadcrumbModule, IonIcon, IonToast, FormsExportConfigModalComponent, FormsIntegrationsModalComponent]
})
export class FormsSubmissionsPage {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly translationService = inject(TranslationService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly navigationService = inject(NavigationService);

  constructor() {
    addIcons({ downloadOutline, searchOutline, funnelOutline, documentTextOutline, closeOutline, settingsOutline, saveOutline, chevronUpOutline, chevronDownOutline, cloudUploadOutline, addOutline, refreshOutline, checkmarkCircleOutline, trashOutline, openOutline });
  }

  readonly forms = signal<FormDetail[]>([]);
  readonly totalForms = signal<number>(0);
  readonly loading = signal<boolean>(true);
  readonly formsLimit = signal<number>(10);
  readonly formsOffset = signal<number>(0);
  readonly viewState = signal<'list' | 'detail'>('list');
  readonly selectedFormId = signal<number | null>(null);
  readonly submissions = signal<FormSubmission[]>([]);
  readonly submissionsLoading = signal<boolean>(false);
  readonly pageSize = signal<number>(10);
  readonly currentPage = signal<number>(1);
  readonly totalSubmissions = signal<number>(0);
  readonly currentSort = signal<string | undefined>(undefined);

  readonly toastVisible = signal<boolean>(false);
  readonly toastMessage = signal<string>('');
  readonly toastColor = signal<'success' | 'danger'>('danger');

  readonly isExportConfigOpen = signal<boolean>(false);
  readonly exportConfigLoading = signal<boolean>(false);
  readonly exportConfigSaving = signal<boolean>(false);
  readonly exportProfile = signal<ExportProfile | null>(null);
  readonly editableColumns = signal<ExportColumn[]>([]);

  readonly isIntegrationsOpen = signal<boolean>(false);
  readonly integrationsLoading = signal<boolean>(false);
  readonly integrationsSaving = signal<boolean>(false);
  readonly integrationsCreatingSheet = signal<boolean>(false);
  readonly integrationsTestingId = signal<number | null>(null);
  readonly integrationsSyncingId = signal<number | null>(null);
  readonly integrations = signal<ExternalIntegration[]>([]);
  readonly integrationExportProfile = signal<ExportProfile | null>(null);
  readonly integrationForm = signal<IntegrationFormState>(this.createEmptyIntegrationForm());
  readonly googleSheetsCreateForm = signal<GoogleSheetsCreateFormState>(this.createEmptyGoogleSheetsCreateForm());

  selectedForms: FormDetail[] = [];
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

  get statuses() {
    return [
      { label: this.translationService.instant('admin.settingsForms.status.AC'), value: AppStatus.Active },
      { label: this.translationService.instant('admin.settingsForms.status.I'), value: AppStatus.Inactive },
      { label: this.translationService.instant('admin.settingsForms.status.P'), value: AppStatus.Pending },
      { label: this.translationService.instant('admin.settingsForms.status.D'), value: AppStatus.Draft },
    ];
  }

  get actions() {
    return [
      { label: this.translationService.instant('admin.settingsForms.actions.simple'), value: FormAction.Simple },
      { label: this.translationService.instant('admin.settingsForms.actions.register-player'), value: FormAction.RegisterPlayer },
      { label: this.translationService.instant('admin.settingsForms.actions.become-member'), value: FormAction.BecomeMember },
    ];
  }

  async ngOnInit(): Promise<void> {
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

  async onFormsPage(event: { first: number; rows: number }): Promise<void> {
    const rowsChanged = event.rows !== this.formsLimit();
    this.formsLimit.set(event.rows);
    this.formsOffset.set(rowsChanged ? 0 : event.first);
    await this.loadForms();
  }

  private async loadForms(): Promise<void> {
    this.loading.set(true);
    try {
      const clubId = this.clubService.getCurrentClubId();
      if (clubId !== null) {
        const result = await this.formService.getFormsByClubId(clubId, AppStatus.Active, true, this.formsLimit(), this.formsOffset());
        this.forms.set(result);
      }
    } catch (error) {
      console.error(error);
      this.submissions.set([]);
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

  async clearSubmissionsFilter(dt: Table): Promise<void> {
    this.submissionsSearchValue = '';
    dt.reset();
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

  async exportSubmissions(): Promise<void> {
    for (const form of this.selectedForms) {
      try {
        await this.formSubmissionsService.exportSubmissions(form.id, form.name);
      } catch {
        this.showToast(this.translationService.instant('admin.forms.exportError'), 'danger');
        return;
      }
    }
  }

  async exportCurrentForm(): Promise<void> {
    const form = this.selectedForm();
    if (!form) return;

    try {
      await this.formSubmissionsService.exportSubmissions(form.id, form.name);
    } catch {
      this.showToast(this.translationService.instant('admin.forms.exportError'), 'danger');
    }
  }

  async openExportConfig(form?: FormDetail): Promise<void> {
    const targetForm = form ?? (this.selectedForms.length === 1 ? this.selectedForms[0] : this.selectedForm());
    if (!targetForm) {
      this.showToast(this.translationService.instant('admin.forms.exportConfig.selectOne'), 'danger');
      return;
    }

    this.isExportConfigOpen.set(true);
    this.exportConfigLoading.set(true);
    this.exportProfile.set(null);
    this.editableColumns.set([]);

    try {
      const profile = await this.formSubmissionsService.getExportProfile(targetForm.id);
      this.exportProfile.set(profile);
      this.editableColumns.set(profile.columns.map(column => ({ ...column })).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading export profile:', error);
      this.showToast(this.translationService.instant('admin.forms.exportConfig.loadError'), 'danger');
      this.closeExportConfig();
    } finally {
      this.exportConfigLoading.set(false);
    }
  }

  closeExportConfig(): void {
    this.isExportConfigOpen.set(false);
    this.exportProfile.set(null);
    this.editableColumns.set([]);
    this.exportConfigLoading.set(false);
    this.exportConfigSaving.set(false);
  }

  toggleExportColumn(index: number, isEnabled: boolean): void {
    const columns = this.editableColumns().map((column, columnIndex) => columnIndex === index ? { ...column, isEnabled } : column);
    this.editableColumns.set(columns);
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

  async saveExportConfig(): Promise<void> {
    const profile = this.exportProfile();
    if (!profile || this.exportConfigSaving()) return;

    const columns = this.editableColumns().map((column, index) => ({ ...column, order: index }));
    if (!columns.some(column => column.isEnabled)) {
      this.showToast(this.translationService.instant('admin.forms.exportConfig.atLeastOne'), 'danger');
      return;
    }

    if (columns.some(column => column.isEnabled && !column.header.trim())) {
      this.showToast(this.translationService.instant('admin.forms.exportConfig.headerRequired'), 'danger');
      return;
    }

    const request: SaveExportProfileRequest = {
      name: profile.name,
      columns: columns.map(column => ({
        sourceKind: ExportColumnSourceKind.FormField,
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
      this.showToast(this.translationService.instant('admin.forms.exportConfig.saveSuccess'), 'success');
      this.closeExportConfig();
    } catch (error) {
      console.error('Error saving export profile:', error);
      this.showToast(this.translationService.instant('admin.forms.exportConfig.saveError'), 'danger');
    } finally {
      this.exportConfigSaving.set(false);
    }
  }

  async openIntegrations(): Promise<void> {
    const form = this.selectedForm();
    if (!form) return;

    this.isIntegrationsOpen.set(true);
    this.integrationsLoading.set(true);
    this.integrations.set([]);
    this.integrationExportProfile.set(null);
    this.integrationForm.set(this.createEmptyIntegrationForm());
    this.googleSheetsCreateForm.set(this.createEmptyGoogleSheetsCreateForm(form.name));

    try {
      const [profile, integrations] = await Promise.all([
        this.ensureSavedExportProfile(form),
        this.formSubmissionsService.getIntegrations(form.id)
      ]);

      this.integrationExportProfile.set(profile);
      this.integrations.set(integrations);
    } catch (error) {
      console.error('Error loading integrations:', error);
      this.showToast(this.translationService.instant('admin.forms.integrations.loadError'), 'danger');
      this.closeIntegrations();
    } finally {
      this.integrationsLoading.set(false);
    }
  }

  closeIntegrations(): void {
    this.isIntegrationsOpen.set(false);
    this.integrationsLoading.set(false);
    this.integrationsSaving.set(false);
    this.integrationsCreatingSheet.set(false);
    this.integrationsTestingId.set(null);
    this.integrationsSyncingId.set(null);
    this.integrations.set([]);
    this.integrationExportProfile.set(null);
    this.integrationForm.set(this.createEmptyIntegrationForm());
    this.googleSheetsCreateForm.set(this.createEmptyGoogleSheetsCreateForm());
  }

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
    const profile = this.integrationExportProfile();
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

  private async ensureSavedExportProfile(form: FormDetail): Promise<ExportProfile> {
    const profile = await this.formSubmissionsService.getExportProfile(form.id);
    if (profile.id) return profile;

    const request: SaveExportProfileRequest = {
      name: profile.name,
      columns: profile.columns.map((column, index) => ({
        sourceKind: ExportColumnSourceKind.FormField,
        sourceKey: column.sourceKey,
        header: column.header,
        order: index,
        isEnabled: column.isEnabled,
        format: column.format ?? null
      }))
    };

    return await this.formSubmissionsService.saveExportProfile(form.id, request);
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

  clear(dt: Table): void {
    this.searchValue = '';
    dt.reset();
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
