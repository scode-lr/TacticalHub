import { Component, inject, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IonModal, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormField } from '@core/models/form-field.model';
import { DynamicFormFieldsComponent } from '@components/dynamic-form-fields/dynamic-form-fields.component';
import { addIcons } from 'ionicons';
import { closeOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-form-preview-modal',
  templateUrl: './form-preview-modal.component.html',
  styleUrls: ['./form-preview-modal.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonModal,
    IonIcon,
    TranslatePipe,
    DynamicFormFieldsComponent,
  ]
})
export class FormPreviewModalComponent {
  private readonly fb = inject(FormBuilder);

  readonly isOpen = input.required<boolean>();
  readonly fields = input.required<FormField[]>();
  readonly formName = input<string>('');
  readonly didDismiss = output<void>();

  previewForm!: FormGroup;

  constructor() {
    addIcons({ closeOutline, eyeOutline });
    effect(() => {
      this.buildPreviewForm(this.fields());
    });
  }

  private buildPreviewForm(fields: FormField[]): void {
    const group: Record<string, ReturnType<FormBuilder['control']>> = {};
    for (const field of fields) {
      const defaultValue = field.type === 'boolean' && !field.options?.length ? false : null;
      group[field.key] = this.fb.control(defaultValue);
    }
    this.previewForm = this.fb.group(group);
  }

  close(): void {
    this.didDismiss.emit();
  }
}
