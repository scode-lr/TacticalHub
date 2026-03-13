import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormHeader } from '@models/form-header.model';
import { AppStatus } from '@models/app-status.model';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { FormAction } from '@core/models/form-action.enum';
import { SettingsFormFieldsComponent } from './settings-form-fields/settings-form-fields.component';
import { FormService } from '@core/services/form.service';
import { ToastService } from '@core/services/toast.service';
import { CreateFormRequest, UpdateFormRequest } from '@core/requests/form.request';
import { RolesService } from '@services/roles.service';
import { FormDetail } from '@core/responses/form.response';

interface HeaderFormControls {
  name: FormControl<string>;
  description: FormControl<string>;
  fromDate: FormControl<string>;
  toDate: FormControl<string>;
  status: FormControl<AppStatus>;
  action: FormControl<string>;
  fields: FormArray;
}

@Component({
  selector: 'app-settings-form-detail',
  templateUrl: './settings-form-detail.page.html',
  styleUrls: ['./settings-form-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonIcon, TranslatePipe, BackButtonComponent, SettingsFormFieldsComponent]
})
export class SettingsFormDetailPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormService);
  private readonly roleService = inject(RolesService);
  private readonly toastService = inject(ToastService);

  readonly isEditMode = signal<boolean>(false);
  readonly formId = signal<string | null>(null);
  readonly isSaving = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'admin.settingsForms.editForm' : 'admin.settingsForms.newForm'
  );

  readonly statusOptions = [
    AppStatus.Active,
    AppStatus.Inactive,
    AppStatus.Pending,
    AppStatus.Draft,
    AppStatus.Archived
  ];

  readonly actionOptions = Object.values(FormAction);

  form!: FormGroup;

  get ctrl(): HeaderFormControls {
    return this.form.controls as unknown as HeaderFormControls;
  }

  constructor() {
    addIcons({ saveOutline });
  }

  async ngOnInit(): Promise<void> {
    const id = this.navigationService.findRouteParam('formId');
    this.isEditMode.set(id !== 'new');
    this.formId.set(id);
    this.isLoading.set(true);
    this.buildForm(this.isEditMode() ? await this.fetchFormById(id!) : null);
    this.isLoading.set(false);
  }

  get fieldsArray(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const selectedRole = this.roleService.getCurrentRole();
    const clubId = selectedRole?.clubId;
    if (!clubId) return;

    const value = this.form.getRawValue();
    console.log('Form submission value:', value);
    const request: CreateFormRequest = {
      clubId,
      name: value.name,
      description: value.description || null,
      fromDate: value.fromDate ? new Date(value.fromDate).toISOString() : null,
      toDate: value.toDate ? new Date(value.toDate).toISOString() : null,
      status: value.status,
      action: value.action,
      fields: (value.fields as any[]).map((f, index) => ({
        key: f.key,
        label: f.label,
        description: f.description || null,
        type: f.type,
        isRequired: f.required ?? false,
        maxLength: f.length ?? null,
        order: index + 1,
        options: f.options?.length ? f.options : null,
        validationJson: null
      }))
    };

    this.isSaving.set(true);
    try {
      if (this.isEditMode() && this.formId()) {
        const updateRequest: UpdateFormRequest = {
          name: request.name,
          description: request.description,
          fromDate: request.fromDate,
          toDate: request.toDate,
          status: request.status,
          action: request.action,
          fields: request.fields
        };
        await this.formService.updateForm(Number(this.formId()), updateRequest);
        this.toastService.show('admin.settingsForms.updateSuccess');
      } else {
        await this.formService.createForm(request);
        this.toastService.show('admin.settingsForms.createSuccess');
      }
      this.navigationService.goBack();
    } catch {
      const errorKey = this.isEditMode() ? 'admin.settingsForms.updateError' : 'admin.settingsForms.createError';
      this.toastService.show(errorKey, 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  private buildForm(existing: FormDetail | null): void {
    const fieldsArray = this.fb.array(
      (existing?.fields ?? []).map(f =>
        this.fb.group({
          key: [f.key, [Validators.required, Validators.pattern(/^[a-z][a-z0-9_]*$/)]],
          label: [f.label, Validators.required],
          description: [f.description ?? ''],
          type: [f.type, Validators.required],
          length: [f.length ?? null],
          required: [f.required ?? false],
          order: [f.order],
          options: this.fb.array((f.options ?? []).map(o => this.fb.control(o, Validators.required)))
        })
      )
    );

    console.log('Existing form data:', existing);
    this.form = this.fb.group({
      name: [existing?.name ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [existing?.description ?? '', Validators.maxLength(500)],
      fromDate: [existing ? this.toInputDate(existing.fromDate) : ''],
      toDate: [existing ? this.toInputDate(existing.toDate) : ''],
      status: [existing?.status ?? AppStatus.Draft, Validators.required],
      action: [existing?.action ?? '', Validators.required],
      fields: fieldsArray
    });
  }

  private toInputDate(date: Date | null): string {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  }

  private async fetchFormById(id: string): Promise<FormDetail | null> {
    return await this.formService.getFormById(Number(id));
  }
}
