export type FormFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'boolean'
  | 'select'
  | 'file';

export interface FormField {
  id: number;
  formId: number;
  key: string;
  label: string;
  description: string;
  type: FormFieldType;
  length: number | null;
  required: boolean;
  order: number;
  createdAt: Date;
}
