import { Component, Input, Output, EventEmitter, signal, computed, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonTextarea, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@core/services/i18n/translation.service';
import { FormField } from '@pages/action/action.config';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    TranslatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  @Input() fields: FormField[] = [];
  @Input() submitLabel = 'common.submit';
  @Input() cancelLabel = 'common.cancel';
  @Input() isSubmitting = false;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  readonly form = signal<FormGroup | null>(null);
  readonly formValid = signal<boolean>(false);

  readonly isFormValid = computed(() => this.formValid());

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const formGroup: { [key: string]: any } = {};

    this.fields.forEach(field => {
      const validators: ValidatorFn[] = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }

      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }

      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      formGroup[field.name] = ['', validators];
    });

    this.form.set(this.fb.group(formGroup));
    
    const formInstance = this.form();
    if (formInstance) {
      this.formValid.set(formInstance.valid);
      
      formInstance.valueChanges.subscribe(() => {
        this.formValid.set(formInstance.valid);
      });
      
      formInstance.statusChanges.subscribe(() => {
        this.formValid.set(formInstance.valid);
      });
    }
  }

  getFieldError(fieldName: string): string | null {
    const formValue = this.form();
    if (!formValue) return null;

    const control = formValue.get(fieldName);
    if (!control || !control.errors || !control.touched) return null;

    const field = this.fields.find(f => f.name === fieldName);

    if (control.errors['required']) {
      return this.translationService.instant('viewer.action.form.errors.required');
    }

    if (control.errors['email']) {
      return field?.errorMessage || this.translationService.instant('viewer.action.form.errors.email');
    }

    if (control.errors['pattern']) {
      return field?.errorMessage || this.translationService.instant('viewer.action.form.errors.pattern');
    }

    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return this.translationService.instant('viewer.action.form.errors.minLength', { min: minLength });
    }

    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return this.translationService.instant('viewer.action.form.errors.maxLength', { max: maxLength });
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const formValue = this.form();
    if (!formValue) return false;

    const control = formValue.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    const formValue = this.form();

    if (!formValue || formValue.invalid) {
      Object.keys(formValue?.controls || {}).forEach(key => {
        formValue?.get(key)?.markAsTouched();
      });
      return;
    }

    this.formSubmit.emit(formValue.value);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
