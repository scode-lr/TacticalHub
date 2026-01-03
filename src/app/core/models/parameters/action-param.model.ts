export interface ActionParameter {
  type: ActionType;
  icon: string;
  title: string;
  description: string;
  id: number;
  fields: FormField[];
}

export type ActionType = 'register-player' | 'become-member';

export type FieldType = 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'number';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  minLength?: number;
  maxLength?: number;
}