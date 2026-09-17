import { Component, inject, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppStatus } from '@core/models/app-status.model';
import { InputTextModule } from 'primeng/inputtext';
import { FormField } from '@core/models/form-field.model';
import { formatIban, formattedIbanLength, ibanLengthFor, MAX_IBAN_LENGTH } from '@core/utils/iban.util';

@Component({
  selector: 'app-dynamic-form-fields',
  templateUrl: './dynamic-form-fields.component.html',
  styleUrls: ['./dynamic-form-fields.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    RadioButtonModule,
  ]
})
export class DynamicFormFieldsComponent {
  private readonly translationService = inject(TranslationService);

  readonly fields = input.required<FormField[]>();
  readonly form = input.required<FormGroup>();

  readonly AppStatus = AppStatus;

  formatIbanInput(field: FormField, event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawLimit = this.ibanRawMaxLength(field, input.value);
    const formatted = formatIban(input.value, rawLimit);

    if (input.value !== formatted) {
      this.form().get(field.key)?.setValue(formatted);
    }
  }

  ibanInputMaxLength(field: FormField): number {
    const value = String(this.form().get(field.key)?.value ?? '');
    return formattedIbanLength(this.ibanRawMaxLength(field, value));
  }

  private ibanRawMaxLength(field: FormField, value: string): number {
    const configuredLimit = field.maxLength && field.maxLength > 0
      ? field.maxLength
      : MAX_IBAN_LENGTH;
    return Math.min(configuredLimit, ibanLengthFor(value));
  }

  /**
   * A boolean field with authored options is a pick-one list and answers with the option text.
   * Without options it is a plain yes/no question, so the answer is a real boolean and only the
   * labels are translated.
   */
  booleanOptions(field: FormField): { value: string | boolean; label: string }[] {
    const options = field.options;
    if (options?.length) return options.map(option => ({ value: option, label: option }));

    return [
      { value: true, label: this.translationService.instant('common.yes') },
      { value: false, label: this.translationService.instant('common.no') },
    ];
  }

  isFieldInvalid(field: FormField): boolean {
    const ctrl = this.form().get(field.key);
    return !!(ctrl?.invalid && ctrl?.touched) || this.isFieldRejected(field);
  }

  isFieldRejected(field: FormField): boolean {
    const ctrl = this.form().get(field.key);
    return field.status === AppStatus.Rejected && !ctrl?.dirty;
  }

  fieldErrorMessage(field: FormField): { key: string; params?: Record<string, unknown> } | null {
    const ctrl = this.form().get(field.key);
    const errors = ctrl?.errors;
    if (!ctrl || !ctrl.touched || !errors) return null;

    if (errors['required']) return { key: 'validation.required' };
    if (errors['email']) return { key: 'validation.invalidEmail' };
    if (errors['iban']) return { key: 'validation.invalidIban' };
    if (errors['maxlength']) return { key: 'validation.maxLength', params: { max: errors['maxlength'].requiredLength } };
    return null;
  }

}
