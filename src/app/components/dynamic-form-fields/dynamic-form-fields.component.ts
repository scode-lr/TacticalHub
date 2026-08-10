import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppStatus } from '@core/models/app-status.model';
import { InputTextModule } from 'primeng/inputtext';
import { FormField } from '@core/models/form-field.model';

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
    ToggleSwitchModule,
    RadioButtonModule,
  ]
})
export class DynamicFormFieldsComponent {
  readonly fields = input.required<FormField[]>();
  readonly form = input.required<FormGroup>();
  readonly fieldStates = input<Record<string, AppStatus>>({});

  readonly AppStatus = AppStatus;

  isFieldInvalid(field: FormField): boolean {
    const ctrl = this.form().get(field.key);
    return !!(ctrl?.invalid && ctrl?.touched) || field.status === AppStatus.Rejected;
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
