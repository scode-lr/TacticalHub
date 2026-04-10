import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonIcon, IonSpinner, IonButton, IonInput, IonCheckbox } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormsService } from '@services/forms.service';
import { SnackbarService } from '@services/snackbar.service';
import { Form, FormField, FormFieldType } from '@core/models/form.model';
import { SubmitFormRequest } from '@core/requests/form.request';

@Component({
  selector: 'app-form-submit',
  templateUrl: './form-submit.page.html',
  styleUrls: ['./form-submit.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonSpinner,
    IonButton,
    IonInput,
    IonCheckbox,
    TranslatePipe
  ]
})
export class FormSubmitPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly formsService = inject(FormsService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  readonly form = signal<Form | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly submitSuccess = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly fieldForm = signal<FormGroup | null>(null);

  readonly FormFieldType = FormFieldType;

  async ngOnInit(): Promise<void> {
    const formId = Number(this.route.snapshot.paramMap.get('formId'));
    if (!formId) {
      this.goBack();
      return;
    }
    await this.loadForm(formId);
  }

  private async loadForm(formId: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const result = await this.formsService.getFormWithFields(formId);
      if (!result) {
        this.goBack();
        return;
      }
      this.form.set(result);
      this.buildForm(result.fields ?? []);
    } catch {
      this.error.set('forms.errors.loadError');
    } finally {
      this.isLoading.set(false);
    }
  }

  private buildForm(fields: FormField[]): void {
    const group: Record<string, unknown> = {};
    const sorted = [...fields].sort((a, b) => a.order - b.order);
    sorted.forEach(field => {
      const validators = [];
      if (field.isRequired) validators.push(Validators.required);
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      group[field.key] = [null, validators];
    });
    this.fieldForm.set(this.fb.group(group));
  }

  getSortedFields(): FormField[] {
    return [...(this.form()?.fields ?? [])].sort((a, b) => a.order - b.order);
  }

  isFieldInvalid(key: string): boolean {
    const fg = this.fieldForm();
    if (!fg) return false;
    const control = fg.get(key);
    return !!(control?.invalid && control?.touched);
  }

  async onSubmit(): Promise<void> {
    const fg = this.fieldForm();
    const formData = this.form();
    if (!fg || !formData) return;

    if (fg.invalid) {
      Object.keys(fg.controls).forEach(key => fg.get(key)?.markAsTouched());
      return;
    }

    this.isSubmitting.set(true);
    try {
      const request: SubmitFormRequest = { values: fg.value };
      await this.formsService.submitForm(formData.id, request);
      this.submitSuccess.set(true);
      this.snackbarService.show('forms.submit.success', 'success');
      this.goBack();
    } catch {
      this.snackbarService.show('forms.errors.submitError', 'danger');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onCancel(): void {
    this.goBack();
  }

  private goBack(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms`]);
  }
}
