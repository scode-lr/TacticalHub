import { Component, inject, signal, computed, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { IonIcon, IonToast } from '@ionic/angular/standalone';
import { personAddOutline, documentTextOutline, cardOutline, saveOutline, syncOutline } from 'ionicons/icons';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { AppStatus } from '@models/app-status.model';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { SectionFooterActionsComponent } from '@components/section-footer-actions/section-footer-actions.component';
import { PreviewModalComponent } from '@components/modals/preview-modal/preview-modal.component';
import { FormPreviewContentComponent } from '@components/form-preview-content/form-preview-content.component';
import { FormField } from '@core/models/form-field.model';
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
  fromDate: FormControl<string | null>;
  toDate: FormControl<string | null>;
  status: FormControl<AppStatus>;
  action: FormControl<string>;
  requiresSignature: FormControl<boolean>;
  requiresReview: FormControl<boolean>;
  adultsOnly: FormControl<boolean>;
  generatesDocument: FormControl<boolean>;
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
    UserHeaderComponent,
    SectionFooterActionsComponent,
    PreviewModalComponent,
    FormPreviewContentComponent,
    SettingsFormFieldsComponent,
    IonIcon,
    IonToast,
  ]
})
export class SettingsFormDetailPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formService = inject(FormService);
  private readonly roleService = inject(RolesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  readonly isEditMode = signal<boolean>(false);
  readonly formId = signal<string | null>(null);
  readonly isSaving = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly previewOpen = signal<boolean>(false);

  readonly showToast = this.toastService.showToast;
  readonly toastMessage = this.toastService.toastMessage;
  readonly toastColor = this.toastService.toastColor;

  onToastDismiss(): void {
    this.toastService.hide();
  }

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'admin.settingsForms.editForm' : 'admin.settingsForms.newForm'
  );

  get statusItems() {
    return [
      { label: this.translationService.instant('admin.settingsForms.status.AC'), value: AppStatus.Active },
      { label: this.translationService.instant('admin.settingsForms.status.I'), value: AppStatus.Inactive },
      { label: this.translationService.instant('admin.settingsForms.status.E'), value: AppStatus.Expired },
      { label: this.translationService.instant('admin.settingsForms.status.D'), value: AppStatus.Draft },
    ];
  }

  /** The type is chosen once, before the builder opens, and stays fixed from then on. */
  readonly selectedAction = signal<FormAction>(FormAction.Simple);

  readonly typeIcon = computed((): string => {
    switch (this.selectedAction()) {
      case FormAction.RegisterPlayer: return 'person-add-outline';
      case FormAction.BecomeMember:   return 'card-outline';
      default:                        return 'document-text-outline';
    }
  });

  readonly typeLabelKey = computed(() => `admin.settingsForms.actions.${this.selectedAction()}`);

  form!: FormGroup;

  get ctrl(): HeaderFormControls {
    return this.form.controls as unknown as HeaderFormControls;
  }

  constructor() {
    addIcons({ personAddOutline, documentTextOutline, cardOutline, saveOutline, syncOutline });
  }

  async ngOnInit(): Promise<void> {
    const id = this.navigationService.findRouteParam('formId');
    this.isEditMode.set(id !== 'new');
    this.formId.set(id);

    if (!this.isEditMode()) {
      const action = this.route.snapshot.queryParamMap.get('action') as FormAction | null;
      if (!action || !Object.values(FormAction).includes(action)) {
        // The type is chosen from the forms list before landing here; without it
        // there is nothing valid to build.
        this.navigationService.goBack();
        return;
      }
      this.selectedAction.set(action);
    }

    this.isLoading.set(true);
    this.buildForm(this.isEditMode() ? await this.fetchFormById(id!) : null);
    this.isLoading.set(false);
  }

  get fieldsArray(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  get previewFields(): FormField[] {
    return this.fieldsArray.controls.map((ctrl, index) => {
      const v = ctrl.value as {
        key: string; label: string; description: string;
        type: FormField['type']; length: number | null;
        required: boolean; order: number; options: string[];
      };
      return {
        id: index,
        formId: 0,
        key: v.key || `field_${index}`,
        label: v.label || '',
        description: v.description || null,
        type: v.type || 'text',
        maxLength: v.length ?? null,
        isRequired: v.required ?? false,
        order: v.order ?? index + 1,
        options: v.options?.length ? v.options : null,
        validationJson: null,
        createdAt: new Date(),
      };
    });
  }

  openPreview(): void {
    this.previewOpen.set(true);
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show(this.translationService.instant('admin.settingsForms.formInvalid'), 'danger');
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
      fromDate: value.fromDate ? `${value.fromDate}T00:00:00Z` : null,
      toDate: value.toDate ? `${value.toDate}T00:00:00Z` : null,
      status: value.status,
      action: value.action,
      requiresSignature: value.requiresSignature ?? false,
      requiresReview: value.requiresReview ?? false,
      adultsOnly: value.adultsOnly ?? false,
      generatesDocument: value.generatesDocument ?? false,
      fields: (value.fields as any[]).map((f, index) => ({
        key: f.key,
        label: f.label,
        description: f.description || null,
        type: f.type,
        isRequired: f.required ?? false,
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
          requiresSignature: request.requiresSignature,
          requiresReview: request.requiresReview,
          adultsOnly: request.adultsOnly,
          generatesDocument: request.generatesDocument,
          fields: request.fields
        };
        await this.formService.updateForm(Number(this.formId()), updateRequest);
        this.toastService.show(this.translationService.instant('forms.admin.updateSuccess'));
      } else {
        await this.formService.createForm(request);
        this.toastService.show(this.translationService.instant('forms.admin.createSuccess'));
      }
      this.navigationService.goBack();
    } catch {
      const errorKey = this.isEditMode() ? 'forms.admin.updateError' : 'forms.admin.createError';
      this.toastService.show(this.translationService.instant(errorKey), 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  private buildForm(existing: FormDetail | null): void {
    if (existing) {
      this.selectedAction.set(existing.action);
    }

    // Enrolment forms are signed and reviewed by default; the coordinator can still opt out.
    const isEnrolment = this.selectedAction() === FormAction.RegisterPlayer
      || this.selectedAction() === FormAction.BecomeMember;

    const fieldsArray = this.fb.array(
      (existing?.fields ?? []).map(f =>
        this.fb.group({
          id: [f.id],
          key: [f.key],
          label: [f.label, Validators.required],
          description: [f.description ?? '', Validators.maxLength(2000)],
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
      description: [existing?.description ?? '', Validators.maxLength(2000)],
      fromDate: [existing?.fromDate ? String(existing.fromDate).substring(0, 10) : null],
      toDate: [existing?.toDate ? String(existing.toDate).substring(0, 10) : null],
      status: [existing?.status ?? AppStatus.Draft, Validators.required],
      action: [existing?.action ?? this.selectedAction(), Validators.required],
      requiresSignature: [existing?.requiresSignature ?? isEnrolment],
      requiresReview: [existing?.requiresReview ?? isEnrolment],
      adultsOnly: [existing?.adultsOnly ?? false],
      generatesDocument: [existing?.generatesDocument ?? false],
      fields: fieldsArray
    });

    this.bindDocumentToSignature();
  }

  /**
   * A signature is only worth capturing if the document that shows it exists, so requiring one
   * forces the document on and locks the toggle. The API enforces the same rule; this only makes
   * it visible. Disabled controls still reach `getRawValue()`, so the value is submitted.
   */
  private bindDocumentToSignature(): void {
    const signature = this.ctrl.requiresSignature;
    const document = this.ctrl.generatesDocument;

    const sync = (requiresSignature: boolean): void => {
      if (requiresSignature) {
        document.setValue(true, { emitEvent: false });
        document.disable({ emitEvent: false });
      } else {
        document.enable({ emitEvent: false });
      }
    };

    sync(signature.value);
    signature.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sync);
  }

  private async fetchFormById(id: string): Promise<FormDetail | null> {
    return await this.formService.getFormById(Number(id));
  }

}
