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
import { maskIban } from '@core/utils/iban.util';
import { readBooleanValue } from '@core/utils/submission-value.util';
import { FormFieldType, isDisplayOnlyField } from '@core/models/form.model';

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
    const valuesByKey = new Map(detail.values.map(val => [val.fieldKey, val]));
    const fields = this.fieldsToRender(detail);
    const group: Record<string, unknown> = {};

    for (const field of fields) {
      // Informational blocks carry no answer and never become a control.
      if (isDisplayOnlyField(field.type)) continue;

      const val = valuesByKey.get(field.key);
      group[field.key] = [{ value: val ? this.resolveValue(val) : null, disabled: true }];
    }

    this.submissionFields.set(fields);
    this.form.set(this.fb.group(group));
  }

  /**
   * The submission only carries answered fields, so the form definition is what drives the render:
   * it is the only side that still knows about informational blocks, field descriptions and the
   * full list of options. Answers whose field is no longer in the definition are appended so an
   * edited form does not hide what a member actually submitted.
   */
  private fieldsToRender(detail: SubmissionDetail): FormField[] {
    const definition = this.formFields();
    if (!definition.length) return detail.values.map((val, index) => this.fieldFromValue(val, index));

    // This modal is the member's own read-only view of their answers — never the coordination
    // review flow — so per-field approved/rejected styling has no place here even once the
    // submission has been resolved.
    const defined = [...definition].sort((a, b) => a.order - b.order);

    const definedKeys = new Set(definition.map(field => field.key));
    const orphans = detail.values
      .filter(val => !definedKeys.has(val.fieldKey))
      .map((val, index) => this.fieldFromValue(val, definition.length + index));

    return [...defined, ...orphans];
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
      // For select/radio: provide stored value as the only option so p-select renders it. A plain
      // yes/no answer is not a choice list, so it keeps the built-in options.
      options: this.isChoiceValue(val) && val.valueText !== null ? [val.valueText] : null,
    };
  }

  private isChoiceValue(val: SubmissionValue): boolean {
    if (val.fieldType === FormFieldType.Select) return true;
    return val.fieldType === FormFieldType.Checkbox && readBooleanValue(val) === null;
  }

  private resolveValue(val: SubmissionValue): unknown {
    if (val.fieldType === FormFieldType.Checkbox) return readBooleanValue(val) ?? val.valueText;
    if (val.valueNumber !== null) return val.valueNumber;
    if (val.valueDate !== null) return new Date(val.valueDate);
    if (val.fieldType === FormFieldType.Iban) return maskIban(val.valueText);
    if (val.valueText !== null) return val.valueText;
    return null;
  }

  close(): void {
    this.didDismiss.emit();
  }
}
