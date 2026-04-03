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
  description: string | null;
  type: FormFieldType;
  maxLength: number | null;
  isRequired: boolean;
  order: number;
  validationJson: unknown | null;
  createdAt: Date;
  options: string[] | null;
}
