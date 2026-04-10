import { Component, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, documentTextOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { DynamicFormFieldsComponent } from '@components/dynamic-form-fields/dynamic-form-fields.component';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { FormField } from '@core/models/form-field.model';
import { SubmissionDetail } from '@core/responses/form.response';
import { SubmissionValue } from '@core/models/submission-value.model';

@Component({
  selector: 'app-submission-detail-modal',
  templateUrl: './submission-detail-modal.component.html',
  styleUrls: ['./submission-detail-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonModal,
    IonIcon,
    TranslatePipe,
    DynamicFormFieldsComponent,
  ],
})
export class SubmissionDetailModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly formSubmissionsService = inject(FormSubmissionsService);

  readonly isOpen = input.required<boolean>();
  readonly submissionId = input.required<number>();
  readonly formFields = input.required<FormField[]>();

  readonly didDismiss = output<void>();

  readonly loading = signal(false);
  readonly submissionFields = signal<FormField[]>([]);
  readonly form = signal<FormGroup>(this.fb.group({}));

  constructor() {
    addIcons({ closeOutline, documentTextOutline });

    effect(() => {
      if (this.isOpen() && this.submissionId()) {
        this.loadDetail();
      }
    });
  }

  private async loadDetail(): Promise<void> {
    this.loading.set(true);
    try {
      const detail = await this.formSubmissionsService.getSubmission(this.submissionId());
      this.buildFromValues(detail);
    } finally {
      this.loading.set(false);
    }
  }

  private buildFromValues(detail: SubmissionDetail): void {
    const fields: FormField[] = [];
    const group: Record<string, unknown> = {};

    detail.values.forEach((val, index) => {
      const field = this.fieldFromValue(val, index);
      fields.push(field);
      group[field.key] = [{ value: this.resolveValue(val), disabled: true }];
    });

    this.submissionFields.set(fields);
    this.form.set(this.fb.group(group));
  }

  private fieldFromValue(val: SubmissionValue, order: number): FormField {
    return {
      id: val.fieldId,
      formId: 0,
      key: val.fieldKey,
      label: val.fieldLabel,
      description: null,
      type: val.fieldType,
      maxLength: null,
      isRequired: false,
      order,
      validationJson: null,
      createdAt: new Date(),
      // For select/radio: provide stored value as the only option so p-select renders it
      options: (val.fieldType === 'select' || (val.fieldType === 'boolean' && val.valueText !== null))
        ? (val.valueText !== null ? [val.valueText] : [])
        : null,
    };
  }

  private resolveValue(val: SubmissionValue): unknown {
    if (val.valueBoolean !== null) return val.valueBoolean;
    if (val.valueNumber !== null) return val.valueNumber;
    if (val.valueDate !== null) return new Date(val.valueDate);
    if (val.valueText !== null) return val.valueText;
    return null;
  }

  close(): void {
    this.didDismiss.emit();
  }
}
