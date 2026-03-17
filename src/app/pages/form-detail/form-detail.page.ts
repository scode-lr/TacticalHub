import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { FormService } from '@services/form.service';
import { FormField } from '@core/models/form-field.model';
import { FormDetail } from '@core/responses/form.response';
import { BackButtonComponent } from "@components/index";

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.page.html',
  styleUrls: ['./form-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, BackButtonComponent]
})
export class FormDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly toastController = inject(ToastController);
  private readonly formService = inject(FormService);
  private readonly fb = inject(FormBuilder);

  readonly formDetail = signal<FormDetail | null>(null);
  readonly formFields = signal<FormField[]>([]);
  readonly isSubmitting = signal<boolean>(false);
  readonly loading = signal<boolean>(true);

  dynamicForm!: FormGroup;

  async ngOnInit(): Promise<void> {
    const formId = this.route.snapshot.paramMap.get('formId');
    const detail = await this.formService.getFormById(Number(formId));
    const sorted = [...detail.fields].sort((a, b) => a.order - b.order);
    this.formDetail.set(detail);
    this.formFields.set(sorted);
    this.buildDynamicForm(sorted);
    this.loading.set(false);
  }

  private buildDynamicForm(fields: FormField[]): void {
    const group: Record<string, AbstractControl> = {};
    for (const field of fields) {
      if (field.type === 'boolean' && field.options?.length) {
        group[field.key] = this.fb.array(
          field.options.map(() => this.fb.control(false))
        );
      } else {
        const validators = [];
        if (field.isRequired) validators.push(Validators.required);
        if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
        if (field.type === 'email') validators.push(Validators.email);
        const defaultValue = field.type === 'boolean' ? false : null;
        group[field.key] = this.fb.control(defaultValue, validators);
      }
    }
    this.dynamicForm = this.fb.group(group);
  }

  getBooleanControl(key: string, index: number): FormControl {
    return (this.dynamicForm.get(key) as FormArray).at(index) as FormControl;
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
      await new Promise(resolve => setTimeout(resolve, 1500));
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
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/action`]);
  }

  pageTitle(): string {
   return this.formDetail()?.name ?? '';
  }
}

