import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { FormService } from '@services/form.service';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { FormField } from '@core/models/form-field.model';
import { FormDetail } from '@core/responses/form.response';
import { BackButtonComponent } from '@components/index';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.page.html',
  styleUrls: ['./form-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    BackButtonComponent,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    ToggleSwitchModule,
    RadioButtonModule,
    ButtonModule,
  ]
})
export class FormDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly toastController = inject(ToastController);
  private readonly formService = inject(FormService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly fb = inject(FormBuilder);

  private formId = 0;

  readonly formDetail = signal<FormDetail | null>(null);
  readonly formFields = signal<FormField[]>([]);
  readonly isSubmitting = signal<boolean>(false);
  readonly loading = signal<boolean>(true);

  dynamicForm!: FormGroup;
  async ngOnInit(): Promise<void> {
    const formId = this.route.snapshot.paramMap.get('formId');
    this.formId = Number(formId);
    const detail = await this.formService.getFormById(this.formId);
    const sorted = [...detail.fields ?? []].sort((a, b) => a.order - b.order);
    this.formDetail.set(detail);
    this.formFields.set(sorted);
    this.buildDynamicForm(sorted);
    this.loading.set(false);
  }

  private buildDynamicForm(fields: FormField[]): void {
    const group: Record<string, AbstractControl> = {};
    for (const field of fields) {
      const validators = [];
      if (field.isRequired) validators.push(Validators.required);
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      if (field.type === 'email') validators.push(Validators.email);
      const defaultValue = field.type === 'boolean' && !field.options?.length ? false : null;
      group[field.key] = this.fb.control(defaultValue, validators);
    }
    this.dynamicForm = this.fb.group(group);
  }

  onFileChange(key: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dynamicForm.get(key)?.setValue(input.files?.[0] ?? null);
  }

  isFieldInvalid(key: string): boolean {
    const ctrl = this.dynamicForm.get(key);
    return !!(ctrl?.invalid && ctrl?.touched);
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
      await this.formSubmissionsService.submitForm(this.formId, { values });
      const toast = await this.toastController.create({
        message: this.translationService.instant('viewer.action.form.success.submitMessage'),
        duration: 3000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle-outline'
      });
      await toast.present();
      this.goBack();
    } catch {
      const toast = await this.toastController.create({
        message: this.translationService.instant('viewer.action.form.errors.submitError'),
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

  onFormCancel(): void {
    this.goBack();
  }

  private goBack(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms`]);
  }

  pageTitle(): string {
    return this.formDetail()?.name ?? '';
  }
}
