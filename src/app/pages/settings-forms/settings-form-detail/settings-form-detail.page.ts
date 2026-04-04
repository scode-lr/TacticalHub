import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, syncOutline } from 'ionicons/icons';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { FormHeader } from '@models/form-header.model';
import { AppStatus } from '@models/app-status.model';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { FormAction } from '@core/models/form-action.enum';
import { SettingsFormFieldsComponent } from './settings-form-fields/settings-form-fields.component';
import { FormService } from '@core/services/form.service';
import { ToastService } from '@core/services/toast.service';
import { CreateFormRequest, UpdateFormRequest } from '@core/requests/form.request';
import { RolesService } from '@services/roles.service';
import { FormDetail } from '@core/responses/form.response';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

interface HeaderFormControls {
  name: FormControl<string>;
  description: FormControl<string>;
  fromDate: FormControl<Date | null>;
  toDate: FormControl<Date | null>;
  status: FormControl<AppStatus>;
  action: FormControl<string>;
  email: FormControl<string>;
  fields: FormArray;
}

@Component({
  selector: 'app-settings-form-detail',
  templateUrl: './settings-form-detail.page.html',
  styleUrls: ['./settings-form-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    BackButtonComponent,
    SettingsFormFieldsComponent,
    InputTextModule,
    TextareaModule,
    SelectModule,
    IftaLabelModule,
    ButtonModule,
    DatePickerModule,
    IonIcon,
  ]
})
export class SettingsFormDetailPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormService);
  private readonly roleService = inject(RolesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  readonly isEditMode = signal<boolean>(false);
  readonly formId = signal<string | null>(null);
  readonly isSaving = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'admin.settingsForms.editForm' : 'admin.settingsForms.newForm'
  );

  get statusItems() {
    return [
      { label: this.translationService.instant('admin.settingsForms.status.AC'), value: AppStatus.Active },
      { label: this.translationService.instant('admin.settingsForms.status.I'), value: AppStatus.Inactive },
      { label: this.translationService.instant('admin.settingsForms.status.P'), value: AppStatus.Pending },
      { label: this.translationService.instant('admin.settingsForms.status.D'), value: AppStatus.Draft },
      { label: this.translationService.instant('admin.settingsForms.status.AR'), value: AppStatus.Archived },
    ];
  }

  get actionItems() {
    return [
      { label: this.translationService.instant('admin.settingsForms.actions.simple'), value: FormAction.Simple },
      { label: this.translationService.instant('admin.settingsForms.actions.register-player'), value: FormAction.RegisterPlayer },
      { label: this.translationService.instant('admin.settingsForms.actions.become-member'), value: FormAction.BecomeMember },
    ];
  }

  form!: FormGroup;

  get ctrl(): HeaderFormControls {
    return this.form.controls as unknown as HeaderFormControls;
  }

  constructor() {
    addIcons({ saveOutline, syncOutline });
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
    const request: CreateFormRequest = {
      clubId,
      name: value.name,
      description: value.description || null,
      fromDate: value.fromDate ? (value.fromDate as Date).toISOString() : null,
      toDate: value.toDate ? (value.toDate as Date).toISOString() : null,
      status: value.status,
      action: value.action,
      email: value.email || null,
      fields: (value.fields as any[]).map((f, index) => ({
        key: f.key,
        label: f.label,
        description: f.description || null,
        type: f.type,
        isRequired: f.isRequired ?? false,
        maxLength: f.maxLength ?? null,
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
          email: request.email,
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
          length: [f.maxLength ?? null],
          required: [f.isRequired ?? false],
          order: [f.order],
          options: this.fb.array((f.options ?? []).map(o => this.fb.control(o, Validators.required)))
        })
      )
    );

    this.form = this.fb.group({
      name: [existing?.name ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [existing?.description ?? '', Validators.maxLength(500)],
      fromDate: [existing?.fromDate ? new Date(existing.fromDate) : null],
      toDate: [existing?.toDate ? new Date(existing.toDate) : null],
      status: [existing?.status ?? AppStatus.Draft, Validators.required],
      action: [existing?.action ?? '', Validators.required],
      email: [existing?.email ?? '', Validators.email],
      fields: fieldsArray
    });
  }

  private async fetchFormById(id: string): Promise<FormDetail | null> {
    return await this.formService.getFormById(Number(id));
  }
}
