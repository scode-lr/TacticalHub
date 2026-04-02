import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { FormService } from '@core/services/form.service';
import { ClubService } from '@core/services/club.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { FormDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
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


@Component({
  selector: 'app-forms-submissions',
  templateUrl: './forms-submissions.page.html',
  styleUrls: ['./forms-submissions.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TableModule, TagModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule, BreadcrumbModule]
})
export class FormsSubmissionsPage {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly translationService = inject(TranslationService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);

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
      { label: this.translationService.instant('admin.settingsForms.status.AR'), value: AppStatus.Archived },
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
    await this.loadForms();
  }

  async onFormsPage(event: { first: number; rows: number }): Promise<void> {
    const rowsChanged = event.rows !== this.formsLimit();
    this.formsLimit.set(event.rows);
    this.formsOffset.set(rowsChanged ? 0 : event.first);
    await this.loadForms();
  }

  private async loadForms(): Promise<void> {
    this.loading.set(true);
    const clubId = this.clubService.getCurrentClubId();
    if (clubId !== null) {
      const result = await this.formService.getFormsByClubId(clubId, undefined, true, this.formsLimit(), this.formsOffset());
      this.forms.set(result);
    }
    this.loading.set(false);
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
    } finally {
      this.submissionsLoading.set(false);
    }
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
      case AppStatus.Archived: return 'secondary';
      default: return undefined;
    }
  }

  getActionSeverity(action: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (action) {
      case FormAction.Simple: return 'info';
      case FormAction.RegisterPlayer: return 'success';
      case FormAction.BecomeMember: return 'warn';
      default: return undefined;
    }
  }
}
