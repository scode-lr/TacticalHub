import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslatePipe } from '@pipes/translate.pipe';
import { FormField } from '@core/models/form-field.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';

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
  isFieldInvalid(key: string): boolean {
    const ctrl = this.form().get(key);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
