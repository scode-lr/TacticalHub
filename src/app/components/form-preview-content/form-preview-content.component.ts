import { Component, inject, input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormFieldsComponent } from '@components/dynamic-form-fields/dynamic-form-fields.component';
import { FormField } from '@core/models/form-field.model';
import { FormFieldType } from '@core/models/form.model';

@Component({
  selector: 'app-form-preview-content',
  templateUrl: './form-preview-content.component.html',
  styleUrls: ['./form-preview-content.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormFieldsComponent]
})
export class FormPreviewContentComponent {
  private readonly fb = inject(FormBuilder);

  readonly fields = input.required<FormField[]>();

  get previewForm(): FormGroup {
    const group: Record<string, ReturnType<FormBuilder['control']>> = {};
    for (const field of this.fields()) {
      const defaultValue = field.type === FormFieldType.Checkbox && !field.options?.length ? false : null;
      group[field.key] = this.fb.control(defaultValue);
    }
    return this.fb.group(group);
  }
}
