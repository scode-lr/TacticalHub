import { Component, input, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, trashOutline, chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormFieldType } from '@core/models/form.model';

@Component({
  selector: 'app-settings-form-fields',
  templateUrl: './settings-form-fields.component.html',
  styleUrls: ['./settings-form-fields.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, IonIcon, InputTextModule, TextareaModule, SelectModule, ToggleSwitchModule]
})
export class SettingsFormFieldsComponent {
  readonly fields = input.required<FormArray>();

  private readonly fb = inject(FormBuilder);
  private readonly translationService = inject(TranslationService);
  private readonly destroyRef = inject(DestroyRef);

  private fieldNotifiers = new Map<number, Subject<void>>();

  readonly fieldTypeOptions: FormFieldType[] = [
    FormFieldType.Text, FormFieldType.Number, FormFieldType.Date, FormFieldType.Iban, FormFieldType.Select, FormFieldType.Checkbox
  ];

  get fieldTypeItems() {
    return this.fieldTypeOptions.map(type => ({
      label: this.translationService.instant(`admin.settingsForms.formFields.types.${type}`),
      value: type,
    }));
  }

  constructor() {
    addIcons({ addOutline, trashOutline, closeOutline, chevronUpOutline, chevronDownOutline });
  }

  generateKey(label: string): string {
    return label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  }

  makeUniqueKey(baseKey: string, currentIndex: number): string {
    if (!baseKey) return '';

    const existingKeys = new Set<string>();
    this.fields().controls.forEach((ctrl, i) => {
      if (i !== currentIndex) {
        const k = ctrl.get('key')?.value;
        if (k) existingKeys.add(k);
      }
    });

    if (!existingKeys.has(baseKey)) return baseKey;

    let suffix = 1;
    while (existingKeys.has(`${baseKey}_${suffix}`)) {
      suffix++;
    }
    return `${baseKey}_${suffix}`;
  }

  addField(): void {
    const newIndex = this.fields().length;
    const notifier = new Subject<void>();
    this.fieldNotifiers.set(newIndex, notifier);

    const fieldGroup = this.fb.group({
      id: [null],
      key: [''],
      label: ['', Validators.required],
      description: ['', Validators.maxLength(2000)],
      type: ['text', Validators.required],
      length: [null, Validators.min(1)],
      required: [false],
      order: [newIndex + 1],
      options: this.fb.array([])
    });

    fieldGroup.get('label')!.valueChanges
      .pipe(takeUntil(notifier), takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string | null) => {
        const baseKey = this.generateKey(value || '');
        const uniqueKey = this.makeUniqueKey(baseKey, newIndex);
        fieldGroup.get('key')!.setValue(uniqueKey, { emitEvent: false });
      });

    this.fields().push(fieldGroup);
  }

  removeField(index: number): void {
    this.fieldNotifiers.get(index)?.complete();
    this.fieldNotifiers.delete(index);

    this.fields().removeAt(index);

    const newMap = new Map<number, Subject<void>>();
    this.fieldNotifiers.forEach((s, oldIdx) => {
      const newIdx = oldIdx > index ? oldIdx - 1 : oldIdx;
      newMap.set(newIdx, s);
    });
    this.fieldNotifiers = newMap;

    this.fields().controls.forEach((ctrl, i) => ctrl.get('order')?.setValue(i + 1));
  }

  moveFieldUp(index: number): void {
    if (index === 0) return;
    this.swapFields(index, index - 1);
  }

  moveFieldDown(index: number): void {
    if (index === this.fields().length - 1) return;
    this.swapFields(index, index + 1);
  }

  private swapFields(indexA: number, indexB: number): void {
    const fields = this.fields();
    const ctrlA = fields.at(indexA);
    const ctrlB = fields.at(indexB);

    fields.removeAt(indexB);
    fields.insert(indexB, ctrlA as FormGroup);
    fields.removeAt(indexA);
    fields.insert(indexA, ctrlB as FormGroup);

    const newMap = new Map<number, Subject<void>>();
    this.fieldNotifiers.forEach((s, idx) => {
      if (idx === indexA) newMap.set(indexB, s);
      else if (idx === indexB) newMap.set(indexA, s);
      else newMap.set(idx, s);
    });
    this.fieldNotifiers = newMap;

    fields.controls.forEach((ctrl, i) => ctrl.get('order')?.setValue(i + 1));
  }

  fieldHasError(index: number, controlName: string): boolean {
    const ctrl = this.fields().at(index).get(controlName);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  fieldHasMaxLengthError(index: number): boolean {
    const ctrl = this.fields().at(index).get('description');
    return !!(ctrl?.invalid && ctrl?.dirty && ctrl?.errors?.['maxlength']);
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
    return [FormFieldType.Text, FormFieldType.Number, FormFieldType.Email, FormFieldType.Iban, FormFieldType.Textarea].includes(type);
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
