import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonIcon, IonSpinner, IonButton, IonInput, IonModal, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormsService } from '@services/forms.service';
import { SnackbarService } from '@services/snackbar.service';
import { Form, FormField, FormFieldType, FormSubmission } from '@core/models/form.model';
import { AppStatus } from '@core/models/app-status.model';
import { AddFormFieldRequest } from '@core/requests/form.request';
import { PaginatedResponse } from '@core/responses/api.response';

@Component({
  selector: 'app-admin-form-detail',
  templateUrl: './admin-form-detail.page.html',
  styleUrls: ['./admin-form-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonSpinner,
    IonButton,
    IonInput,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    TranslatePipe
  ]
})
export class AdminFormDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly formsService = inject(FormsService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  readonly form = signal<Form | null>(null);
  readonly submissions = signal<PaginatedResponse<FormSubmission> | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isLoadingSubmissions = signal<boolean>(false);
  readonly isAddingField = signal<boolean>(false);
  readonly showAddFieldModal = signal<boolean>(false);
  readonly activeTab = signal<'fields' | 'submissions'>('fields');
  readonly error = signal<string | null>(null);

  readonly FormFieldType = FormFieldType;
  readonly AppStatus = AppStatus;
  readonly fieldTypes = Object.values(FormFieldType);

  readonly addFieldForm = this.fb.group({
    key: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    label: ['', Validators.required],
    description: [''],
    type: [FormFieldType.Text, Validators.required],
    isRequired: [false],
    maxLength: [null as number | null],
    order: [1, [Validators.required, Validators.min(1)]]
  });

  async ngOnInit(): Promise<void> {
    const formId = Number(this.route.snapshot.paramMap.get('formId'));
    if (!formId) {
      this.goBack();
      return;
    }
    await this.loadForm(formId);
  }

  private async loadForm(formId: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const result = await this.formsService.getFormWithFields(formId);
      if (!result) {
        this.goBack();
        return;
      }
      this.form.set(result);
    } catch {
      this.error.set('forms.errors.loadError');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadSubmissions(): Promise<void> {
    const formData = this.form();
    if (!formData) return;

    this.isLoadingSubmissions.set(true);
    try {
      const result = await this.formsService.getFormSubmissions(formData.id);
      this.submissions.set(result);
    } catch {
      this.snackbarService.show('forms.errors.loadError', 'danger');
    } finally {
      this.isLoadingSubmissions.set(false);
    }
  }

  setTab(tab: 'fields' | 'submissions'): void {
    this.activeTab.set(tab);
    if (tab === 'submissions' && !this.submissions()) {
      this.loadSubmissions();
    }
  }

  getSortedFields(): FormField[] {
    return [...(this.form()?.fields ?? [])].sort((a, b) => a.order - b.order);
  }

  openAddFieldModal(): void {
    const nextOrder = (this.form()?.fields?.length ?? 0) + 1;
    this.addFieldForm.reset({ type: FormFieldType.Text, isRequired: false, order: nextOrder });
    this.showAddFieldModal.set(true);
  }

  closeAddFieldModal(): void {
    this.showAddFieldModal.set(false);
  }

  async onAddField(): Promise<void> {
    if (this.addFieldForm.invalid) {
      this.addFieldForm.markAllAsTouched();
      return;
    }

    const formData = this.form();
    if (!formData) return;

    this.isAddingField.set(true);
    try {
      const values = this.addFieldForm.value;
      const request: AddFormFieldRequest = {
        key: values.key!,
        label: values.label!,
        description: values.description ?? undefined,
        type: values.type as FormFieldType,
        isRequired: values.isRequired ?? false,
        maxLength: values.maxLength ?? undefined,
        order: values.order!
      };
      const created = await this.formsService.addFormField(formData.id, request);
      if (created) {
        this.form.update(f => f ? { ...f, fields: [...(f.fields ?? []), created] } : f);
        this.closeAddFieldModal();
        this.snackbarService.show('forms.admin.addFieldSuccess', 'success');
      }
    } catch {
      this.snackbarService.show('forms.errors.addFieldError', 'danger');
    } finally {
      this.isAddingField.set(false);
    }
  }

  private goBack(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms`]);
  }
}
