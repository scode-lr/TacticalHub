import { Component, input, inject } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormFieldType } from '@models/form-field.model';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings-form-fields',
  templateUrl: './settings-form-fields.component.html',
  styleUrls: ['./settings-form-fields.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonIcon, TranslatePipe]
})
export class SettingsFormFieldsComponent {
  readonly fields = input.required<FormArray>();

  private readonly fb = inject(FormBuilder);

  readonly fieldTypeOptions: FormFieldType[] = [
    'text', 'number', 'date', 'email', 'phone', 'textarea', 'boolean', 'select', 'file'
  ];

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
