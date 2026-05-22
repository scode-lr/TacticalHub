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
import { FormField } from '@core/models/form-field.model';
import { AppStatus } from '@core/models/app-status.model';
import { parseSubmissionComment, SubmissionCommentEntry } from '@core/utils/submission-comment.util';
import { FormDetail } from '@core/responses/form.response';
import { BackButtonComponent, DynamicFormFieldsComponent } from '@components/index';

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
  private readonly fb = inject(FormBuilder);

  private formId = 0;
  private submissionId = -1;

  readonly formDetail = signal<FormDetail | null>(null);
  readonly formFields = signal<FormField[]>([]);
  readonly isSubmitting = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  readonly rejectedFieldStatuses = signal<Record<string, AppStatus>>({});
  readonly rejectionComments = signal<SubmissionCommentEntry[]>([]);

  readonly isEditing = computed(() => this.submissionId > 0);

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
      const value = v.valueText ?? v.valueNumber ?? v.valueDate ?? v.valueBoolean ?? null;
      if (value !== null) prefill[v.fieldKey] = value;
      if (v.status) statuses[v.fieldKey] = v.status;
    }
    this.dynamicForm.patchValue(prefill);
    this.rejectedFieldStatuses.set(statuses);
    this.rejectionComments.set(parseSubmissionComment(detail.comment));
  }

  private buildDynamicForm(fields: FormField[]): void {
    const group: Record<string, AbstractControl> = {};
    for (const field of fields) {
      const validators = [];
      if (field.isRequired) validators.push(Validators.required);
      if (field.maxLength && field.maxLength > 0) validators.push(Validators.maxLength(field.maxLength));
      if (field.type === 'email') validators.push(Validators.email);
      const defaultValue = field.type === 'boolean' && !field.options?.length ? false : null;
      group[field.key] = this.fb.control(defaultValue, validators);
    }
    this.dynamicForm = this.fb.group(group);
  }

  async onFormSubmit(): Promise<void> {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    try {
      const rawValues = this.dynamicForm.value as Record<string, unknown>;
      const values = Object.keys(rawValues).reduce<Record<string, string | number | boolean | string[]>>((acc, key) => {
        const v = rawValues[key];
        if (v instanceof Date) {
          acc[key] = v.toISOString();
        } else if (v !== null && v !== undefined) {
          acc[key] = v as string | number | boolean | string[];
        }
        return acc;
      }, {});

      if (this.isEditing()) {
        await this.formSubmissionsService.resubmitForm(this.submissionId, { values });
      } else {
        await this.formSubmissionsService.submitForm(this.formId, { values });
      }

      const successKey = this.isEditing()
        ? 'member.action.form.success.resubmitMessage'
        : 'member.action.form.success.submitMessage';
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
        message: this.translationService.instant('member.action.form.errors.submitError'),
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

  pageTitle(): string {
    return this.formDetail()?.name ?? '';
  }

  backRoute(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    if((this.formDetail()?.submissionsCount ?? 0) > 0){
      return `/app/${roleType}/${roleId}/forms/${this.formId}`;
    }
    return `/app/${roleType}/${roleId}/forms`;
  }

  cancelSubmission(): void {
    this.navigationService.navigateTo([this.backRoute()]);
  }

  private goToFormDetail(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms/${this.formId}`]);
  }
}
