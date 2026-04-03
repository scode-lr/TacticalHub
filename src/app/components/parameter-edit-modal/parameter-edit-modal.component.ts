import { Component, input, output, model, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  chevronDownOutline,
  chevronUpOutline,
  trashOutline,
  addOutline,
  addCircleOutline,
  closeCircleOutline,
  codeOutline,
  listOutline,
  createOutline
} from 'ionicons/icons';

import { TranslatePipe } from '@pipes/translate.pipe';
import { Parameter } from '@models/parameters/parameter.model';
import { ParameterType } from '@core/models/parameters/parameter-type.enum';
import { ActionParameter } from '@core/models/parameters/action-param.model';

interface NestedFieldForm {
  arrayIndex: number;
  key: string;
  editIndex?: number;
}

interface FieldData {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  minLength: string;
  maxLength: string;
}

@Component({
  selector: 'app-parameter-edit-modal',
  templateUrl: './parameter-edit-modal.component.html',
  styleUrls: ['./parameter-edit-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton, IonModal, TranslatePipe]
})
export class ParameterEditModalComponent {
  readonly isOpen = model.required<boolean>();
  readonly parameter = input.required<Parameter | null>();
  readonly save = output<{ parameter: Parameter; value: unknown }>();
  readonly cancel = output<void>();

  readonly editedArray = signal<Record<string, unknown>[]>([]);
  readonly editedObject = signal<Record<string, unknown>>({});
  readonly expandedItems = signal<Set<number>>(new Set([0]));
  readonly uxMode = signal<boolean>(true);
  readonly isAddingNestedField = signal<NestedFieldForm | null>(null);
  readonly newNestedFieldData = signal<FieldData>(this.createEmptyFieldData());
  
  editedValue = '';

  readonly isActionParam = computed(() => {
    const param = this.parameter();
    return param?.id === ParameterType.ActionCards || false;
  });

  readonly isInformationParam = computed(() => {
    const param = this.parameter();
    return param?.id === ParameterType.InformationSections || false;
  });

  constructor() {
    addIcons({
      closeOutline,
      chevronDownOutline,
      chevronUpOutline,
      trashOutline,
      addOutline,
      addCircleOutline,
      closeCircleOutline,
      codeOutline,
      listOutline,
      createOutline
    });
  }

  onModalOpen(): void {
    const param = this.parameter();
    if (!param) return;

    if (this.isActionParam() || this.isInformationParam()) {
      this.editedArray.set(this.deepClone(param.value as Record<string, unknown>[]));
      const actionParam = param.value as ActionParameter[];
      if (actionParam.length > 0) {
        this.expandedItems.set(new Set([0]));
      }
    }
  }

  closeModal(): void {
    this.isOpen.set(false);
    this.editedArray.set([]);
    this.editedObject.set({});
    this.cancel.emit();
  }

  toggleViewMode(): void {
    this.uxMode.set(!this.uxMode());
  }

  toggleArrayItem(index: number): void {
    const current = new Set(this.expandedItems());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.expandedItems.set(current);
  }

  getObjectKeys(obj: Record<string, unknown> | null | undefined): string[] {
    if (!obj || typeof obj !== 'object') return [];
    return Object.keys(obj).filter(key => key !== 'id');
  }

  getArrayItemTitle(item: Record<string, unknown>): string {
    return String(item['title'] || item['name'] || item['label'] || item['type'] || 'Item');
  }

  getNestedItemLabel(item: unknown, index: number): string {
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      const label = String(obj['label'] || obj['name'] || obj['value'] || `Item ${index + 1}`);
      const type = obj['type'] ? ` [${obj['type']}]` : '';
      return label + type;
    }
    return String(item);
  }

  isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  isNestedArray(value: unknown): boolean {
    return Array.isArray(value);
  }

  isBoolean(value: unknown): boolean {
    return typeof value === 'boolean';
  }

  isIconField(key: string): boolean {
    return key.toLowerCase() === 'icon';
  }

  isTypeField(key: string): boolean {
    return key.toLowerCase() === 'type';
  }

  isContentField(key: string): boolean {
    return key.toLowerCase() === 'content';
  }

  readonly availableIcons = [
    'person-add-outline',
    'card-outline',
    'settings-outline',
    'people-outline',
    'calendar-outline',
    'football-outline',
    'trophy-outline',
    'shield-outline',
    'star-outline',
    'home-outline',
    'list-outline',
    'notifications-outline',
    'mail-outline',
    'call-outline',
    'location-outline',
    'time-outline',
    'checkmark-circle-outline',
    'close-circle-outline',
    'information-circle-outline',
    'warning-outline',
    'help-circle-outline',
    'document-outline',
    'camera-outline',
    'image-outline',
    'attach-outline',
    'send-outline',
    'share-outline',
    'heart-outline',
    'bookmark-outline',
    'flag-outline',
    'medal-outline',
    'ribbon-outline',
    'basket-outline',
    'cart-outline',
    'cash-outline',
    'wallet-outline'
  ];

  readonly availableActionTypes = [
    { value: 'register-player', labelKey: 'actionTypes.registerPlayer' },
    { value: 'become-member', labelKey: 'actionTypes.becomeMember' }
  ];

  asArray(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
  }

  asObject(value: unknown): Record<string, unknown> {
    return (typeof value === 'object' && value !== null) ? value as Record<string, unknown> : {};
  }

  getNestedValue(obj: unknown, key: string): unknown {
    if (typeof obj === 'object' && obj !== null) {
      return (obj as Record<string, unknown>)[key];
    }
    return '';
  }

  onArrayFieldChange(arrayIndex: number, key: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const updated = [...this.editedArray()];
    updated[arrayIndex] = { ...updated[arrayIndex], [key]: this.parseValue(target.value) };
    this.editedArray.set(updated);
  }

  onNestedFieldChange(arrayIndex: number, key: string, nestedKey: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const updated = [...this.editedArray()];
    const nestedObj = { ...(updated[arrayIndex][key] as Record<string, unknown>) };
    nestedObj[nestedKey] = this.parseValue(target.value);
    updated[arrayIndex] = { ...updated[arrayIndex], [key]: nestedObj };
    this.editedArray.set(updated);
  }

  onBooleanFieldChange(arrayIndex: number, key: string): void {
    const updated = [...this.editedArray()];
    updated[arrayIndex] = { ...updated[arrayIndex], [key]: !updated[arrayIndex][key] };
    this.editedArray.set(updated);
  }

  onObjectFieldChange(key: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.editedObject.set({ ...this.editedObject(), [key]: this.parseValue(target.value) });
  }

  onObjectBooleanChange(key: string): void {
    this.editedObject.set({ ...this.editedObject(), [key]: !this.editedObject()[key] });
  }

  addArrayItem(): void {
    const current = this.editedArray();
    const newItem = current.length > 0 ? this.createEmptyItemFromTemplate(current[0]) : {};
    const updated = [...current, newItem];
    
    this.editedArray.set(updated);
    this.expandItemAtIndex(updated.length - 1);
  }

  deleteArrayItem(index: number): void {
    const updated = this.editedArray().filter((_, i) => i !== index);
    this.editedArray.set(updated);
    const expanded = new Set(this.expandedItems());
    expanded.delete(index);
    this.expandedItems.set(expanded);
  }

  deleteArrayField(arrayIndex: number, key: string): void {
    const updated = [...this.editedArray()];
    const item = { ...updated[arrayIndex] };
    delete item[key];
    updated[arrayIndex] = item;
    this.editedArray.set(updated);
  }

  addNestedArrayItem(arrayIndex: number, key: string): void {
    this.isAddingNestedField.set({ arrayIndex, key });
    this.newNestedFieldData.set(this.createEmptyFieldData());
  }

  editNestedArrayItem(arrayIndex: number, key: string, itemIndex: number): void {
    const nestedArray = this.asArray(this.editedArray()[arrayIndex][key]);
    const itemToEdit = nestedArray[itemIndex] as Record<string, unknown>;
    
    this.isAddingNestedField.set({ arrayIndex, key, editIndex: itemIndex });
    this.newNestedFieldData.set(itemToEdit as unknown as FieldData);
  }

  cancelAddNestedField(): void {
    this.isAddingNestedField.set(null);
  }

  confirmAddNestedField(): void {
    const addingInfo = this.isAddingNestedField();
    if (!addingInfo) return;

    const fieldData = this.cleanFieldData({ ...this.newNestedFieldData() });
    const updated = [...this.editedArray()];
    const nestedArray = [...this.asArray(updated[addingInfo.arrayIndex][addingInfo.key])];
    
    if (addingInfo.editIndex !== undefined) {
      nestedArray[addingInfo.editIndex] = fieldData;
    } else {
      nestedArray.push(fieldData);
    }
    
    updated[addingInfo.arrayIndex] = {
      ...updated[addingInfo.arrayIndex],
      [addingInfo.key]: nestedArray
    };
    this.editedArray.set(updated);
    this.isAddingNestedField.set(null);
  }

  onNewNestedFieldChange(key: string, value: unknown): void {
    this.newNestedFieldData.set({ ...this.newNestedFieldData(), [key]: value });
  }

  getNestedFieldValue(key: string): unknown {
    return (this.newNestedFieldData() as unknown as Record<string, unknown>)[key];
  }

  isShowingFormFor(arrayIndex: number, key: string): boolean {
    const addingInfo = this.isAddingNestedField();
    return addingInfo !== null && addingInfo.arrayIndex === arrayIndex && addingInfo.key === key;
  }

  deleteNestedArrayItem(arrayIndex: number, key: string, nestedIndex: number): void {
    const updated = [...this.editedArray()];
    const nestedArray = [...this.asArray(updated[arrayIndex][key])];
    nestedArray.splice(nestedIndex, 1);
    updated[arrayIndex] = { ...updated[arrayIndex], [key]: nestedArray };
    this.editedArray.set(updated);
  }

  saveParameter(): void {
    const param = this.parameter();
    if (!param) return;

    const newValue = this.getParameterValue();
    this.save.emit({ parameter: param, value: newValue });
    this.closeModal();
  }

  private getParameterValue(): unknown {
    if (this.isActionParam()) return this.editedArray();
    if (this.isInformationParam()) return this.editedObject();
    
    try {
      return JSON.parse(this.editedValue);
    } catch {
      return this.editedValue;
    }
  }

  private createEmptyFieldData(): FieldData {
    return {
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      minLength: '',
      maxLength: ''
    };
  }

  private cleanFieldData(data: Record<string, unknown>): Record<string, unknown> {
    const cleaned = { ...data };
    const requiredFields = ['name', 'label', 'type'];
    
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === '' && !requiredFields.includes(key)) {
        delete cleaned[key];
      }
    });
    
    return cleaned;
  }

  private createEmptyItemFromTemplate(template: Record<string, unknown>): Record<string, unknown> {
    const cloned = this.deepClone(template);
    
    Object.keys(cloned).forEach(key => {
      const value = cloned[key];
      if (typeof value === 'string') cloned[key] = '';
      else if (typeof value === 'number') cloned[key] = 0;
      else if (typeof value === 'boolean') cloned[key] = false;
      else if (Array.isArray(value)) cloned[key] = [];
      else if (typeof value === 'object') cloned[key] = {};
    });
    
    return cloned;
  }

  private expandItemAtIndex(index: number): void {
    const expanded = new Set(this.expandedItems());
    expanded.add(index);
    this.expandedItems.set(expanded);
  }

  private deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  private parseValue(value: string): unknown {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
    return value;
  }

  getFormattedValue(): string {
    const param = this.parameter();
    if (!param) return '';
    
    return typeof param.value === 'object'
      ? JSON.stringify(param.value, null, 2)
      : String(param.value);
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.editedValue = target.value;
  }
}
