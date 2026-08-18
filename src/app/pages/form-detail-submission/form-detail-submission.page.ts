import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonIcon, IonModal, ToastController } from '@ionic/angular/standalone';
import { TimelineModule } from 'primeng/timeline';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { addIcons } from 'ionicons';
import { alertCircleOutline, timeOutline, chatbubbleOutline, closeOutline } from 'ionicons/icons';
import { FormService } from '@services/form.service';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { FormSignatureDraftService } from '@services/form-signature-draft.service';
import { FormField } from '@core/models/form-field.model';
import { AppStatus } from '@core/models/app-status.model';
import { parseSubmissionComment, SubmissionCommentEntry } from '@core/utils/submission-comment.util';
import { FormDetail } from '@core/responses/form.response';
import { BackButtonComponent, DynamicFormFieldsComponent } from '@components/index';
import { isValidIban, normalizeIban } from '@core/utils/iban.util';
import { readBooleanValue } from '@core/utils/submission-value.util';
import { FormFieldType, isDisplayOnlyField } from '@core/models/form.model';

@Component({
  selector: 'app-form-detail-submission',
  templateUrl: './form-detail-submission.page.html',
  styleUrls: ['./form-detail-submission.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonModal,
    TimelineModule,
    TranslatePipe,
    BackButtonComponent,
    DynamicFormFieldsComponent,
  ]
})
export class FormDetailSubmissionPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly toastController = inject(ToastController);
  private readonly formService = inject(FormService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly draftService = inject(FormSignatureDraftService);
  private readonly fb = inject(FormBuilder);

  private formId = 0;
  private submissionId = -1;

  /** `?from=detail` means the submission list; anything else (or nothing) means the forms list. */
  private cameFromSubmissionList = false;

  readonly formDetail = signal<FormDetail | null>(null);
  readonly formFields = signal<FormField[]>([]);
  readonly isSubmitting = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  readonly rejectedFieldStatuses = signal<Record<string, AppStatus>>({});
  readonly rejectionComments = signal<SubmissionCommentEntry[]>([]);
  readonly submissionStatus = signal<AppStatus | null>(null);

  readonly isEditing = computed(() => this.submissionId > 0);
  readonly requiresSignature = computed(() => this.formDetail()?.requiresSignature ?? false);

  readonly activeFormFields = computed<FormField[]>(() => {
    const statuses = this.rejectedFieldStatuses();
    if (!Object.keys(statuses).length) return this.formFields();
    return this.formFields().map(f =>
      statuses[f.key] ? { ...f, status: statuses[f.key] } : f
    );
  });

  dynamicForm!: FormGroup;

  readonly showHistory = signal(false);

  readonly latestComment = computed(() => {
    const comments = this.rejectionComments();
    return comments.length ? comments[comments.length - 1] : null;
  });

  /**
   * Only a rejection carrying coordination's reason earns the banner.
   *
   * The comment history also collects notes left when a submission is approved, so keying the
   * banner off "has a comment" alone showed an alarming red panel to members whose request had
   * actually gone through.
   */
  readonly showRejectionBanner = computed((): boolean =>
    this.submissionStatus() === AppStatus.Rejected
    && !!this.latestComment()?.text?.trim()
  );

  constructor() {
    addIcons({ alertCircleOutline, timeOutline, chatbubbleOutline, closeOutline });
  }

  isLatestComment(entry: SubmissionCommentEntry): boolean {
    const comments = this.rejectionComments();
    return comments.length > 0 && entry === comments[comments.length - 1];
  }

  async ngOnInit(): Promise<void> {
    const formId = this.route.snapshot.paramMap.get('formId');
    const submissionId = this.route.snapshot.paramMap.get('submissionId');
    this.formId = Number(formId);
    this.submissionId = submissionId && submissionId !== '-1' ? Number(submissionId) : -1;
    this.cameFromSubmissionList = this.route.snapshot.queryParamMap.get('from') === 'detail';

    const detail = await this.formService.getFormById(this.formId);
    const sorted = [...detail.fields ?? []].sort((a, b) => a.order - b.order);
    this.formDetail.set(detail);
    this.formFields.set(sorted);
    this.buildDynamicForm(sorted);

    if (this.submissionId > 0) {
      await this.prefillFromSubmission(this.submissionId);
    }

    this.loading.set(false);
  }

  private async prefillFromSubmission(submissionId: number): Promise<void> {
    const detail = await this.formSubmissionsService.getSubmission(submissionId);
    const prefill: Record<string, unknown> = {};
    const statuses: Record<string, AppStatus> = {};
    for (const v of detail.values) {
      // A yes/no answer has to come back as a real boolean or the radio group matches nothing —
      // and older submissions stored it as the text "true"/"false".
      const value = v.fieldType === FormFieldType.Checkbox
        ? readBooleanValue(v) ?? v.valueText
        : v.valueText ?? v.valueNumber ?? v.valueDate ?? v.valueBoolean ?? null;
      if (value !== null) prefill[v.fieldKey] = value;
      if (v.status) statuses[v.fieldKey] = v.status;
    }
    this.dynamicForm.patchValue(prefill);
    this.rejectedFieldStatuses.set(statuses);
    this.rejectionComments.set(parseSubmissionComment(detail.comment));
    this.submissionStatus.set((detail.status as AppStatus) ?? null);
  }

  private buildDynamicForm(fields: FormField[]): void {
    const group: Record<string, AbstractControl> = {};
    for (const field of fields) {
      // Informational text renders as content and never becomes a control.
      if (isDisplayOnlyField(field.type)) continue;

      const validators = [];
      if (field.isRequired) validators.push(Validators.required);
      if (field.maxLength && field.maxLength > 0) validators.push(Validators.maxLength(field.maxLength));
      if (field.type === FormFieldType.Email) validators.push(Validators.email);
      if (field.type === FormFieldType.Iban) validators.push((control: AbstractControl) => {
        const value = control.value as string | null;
        return !value || isValidIban(value) ? null : { iban: true };
      });
      // Nothing is pre-answered, booleans included: a yes/no question starts with neither picked.
      group[field.key] = this.fb.control(null, validators);
    }
    this.dynamicForm = this.fb.group(group);
  }

  async onFormSubmit(): Promise<void> {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }

    const values = this.collectValues();

    // Forms that require a signature get one more step instead of submitting straight away.
    if (this.requiresSignature()) {
      const detail = this.formDetail()!;
      this.draftService.set({
        formId: this.formId,
        submissionId: this.submissionId,
        formName: detail.name,
        formDescription: detail.description ?? null,
        fields: this.formFields(),
        values,
        from: this.cameFromSubmissionList ? 'detail' : 'forms',
      });

      const { roleType, roleId } = this.navigationService.extractRoleDetails();
      this.navigationService.navigateTo([
        `/app/${roleType}/${roleId}/forms/${this.formId}/${this.submissionId}/sign`
      ]);
      return;
    }

    this.isSubmitting.set(true);
    try {
      if (this.isEditing()) {
        await this.formSubmissionsService.resubmitForm(this.submissionId, { values });
      } else {
        await this.formSubmissionsService.submitForm(this.formId, { values });
      }

      const successKey = this.isEditing()
        ? 'user.action.form.success.resubmitMessage'
        : 'user.action.form.success.submitMessage';
      const toast = await this.toastController.create({
        message: this.translationService.instant(successKey),
        duration: 3000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle-outline'
      });
      await toast.present();
      this.goToFormDetail();
    } catch {
      const toast = await this.toastController.create({
        message: this.translationService.instant('user.action.form.errors.submitError'),
        duration: 3000,
        position: 'top',
        color: 'danger',
        icon: 'alert-circle-outline'
      });
      await toast.present();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /** Normalizes the raw control values into the payload the API expects. */
  private collectValues(): Record<string, string | number | boolean | string[]> {
    const rawValues = this.dynamicForm.value as Record<string, unknown>;
    const fieldsByKey = new Map(this.formFields().map(field => [field.key, field]));

    return Object.keys(rawValues).reduce<Record<string, string | number | boolean | string[]>>((acc, key) => {
      const v = rawValues[key];
      if (v instanceof Date) {
        acc[key] = v.toISOString();
      } else if (fieldsByKey.get(key)?.type === FormFieldType.Iban && typeof v === 'string') {
        acc[key] = normalizeIban(v);
      } else if (v !== null && v !== undefined) {
        acc[key] = v as string | number | boolean | string[];
      }
      return acc;
    }, {});
  }

  pageTitle(): string {
    return this.formDetail()?.name ?? '';
  }

  /**
   * Returns to the page the member actually came from, carried in `?from`.
   *
   * It used to branch on `formDetail().submissionsCount`, which counts the whole form's approved
   * submissions across every member — so a form other people had filled sent you "back" to your own
   * empty submission list, a page you had never been on.
   */
  backRoute(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const base = `/app/${roleType}/${roleId}/forms`;

    return this.cameFromSubmissionList ? `${base}/${this.formId}` : base;
  }

  cancelSubmission(): void {
    this.navigationService.navigateTo([this.backRoute()]);
  }

  private goToFormDetail(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms/${this.formId}`]);
  }
}
