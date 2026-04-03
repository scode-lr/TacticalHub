import { Component, input, inject } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { FormFieldType } from '@models/form-field.model';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, trashOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-form-fields',
  templateUrl: './settings-form-fields.component.html',
  styleUrls: ['./settings-form-fields.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, InputTextModule, SelectModule, ToggleSwitchModule, IonIcon]
})
export class SettingsFormFieldsComponent {
  readonly fields = input.required<FormArray>();

  private readonly fb = inject(FormBuilder);
  private readonly translationService = inject(TranslationService);

  readonly fieldTypeOptions: FormFieldType[] = [
    'text', 'number', 'date', 'email', 'phone', 'textarea', 'boolean', 'select', 'file'
  ];

  get fieldTypeItems() {
    return this.fieldTypeOptions.map(type => ({
      label: this.translationService.instant(`admin.settingsForms.formFields.types.${type}`),
      value: type,
    }));
  }

  constructor() {
    addIcons({ addOutline, trashOutline, closeOutline });
  }

  addField(): void {
    this.fields().push(
      this.fb.group({
        key: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9_]*$/)]],
        label: ['', Validators.required],
        description: [''],
        type: ['text', Validators.required],
        length: [null],
        required: [false],
        order: [this.fields().length + 1],
        options: this.fb.array([])
      })
    );
  }

  removeField(index: number): void {
    this.fields().removeAt(index);
    this.fields().controls.forEach((ctrl, i) => ctrl.get('order')?.setValue(i + 1));
  }

  fieldHasError(index: number, controlName: string): boolean {
    const ctrl = this.fields().at(index).get(controlName);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  asFormGroup(index: number): FormGroup {
    return this.fields().at(index) as FormGroup;
  }

  hasOptions(fieldIndex: number): boolean {
    const type = this.asFormGroup(fieldIndex).get('type')?.value;
    return type === 'select' || type === 'boolean';
  }

  hasLength(fieldIndex: number): boolean {
    const type = this.asFormGroup(fieldIndex).get('type')?.value;
    return ['text', 'number', 'email', 'textarea'].includes(type);
  }

  getOptionsArray(fieldIndex: number): FormArray {
    return this.asFormGroup(fieldIndex).get('options') as FormArray;
  }

  addOption(fieldIndex: number): void {
    this.getOptionsArray(fieldIndex).push(this.fb.control('', Validators.required));
  }

  removeOption(fieldIndex: number, optionIndex: number): void {
    this.getOptionsArray(fieldIndex).removeAt(optionIndex);
  }
}
