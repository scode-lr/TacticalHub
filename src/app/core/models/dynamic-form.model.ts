export type DynamicFieldType = 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'number' | 'checkbox' | 'radio';

export type FormStatus = 'active' | 'inactive' | 'draft';

export type SubmissionStatus = 'pending' | 'processed' | 'rejected';

export interface DynamicFormFieldOption {
  Value: string;
  Label: string;
}

export interface DynamicFormField {
  Id: string;
  Name: string;
  Label: string;
  Type: DynamicFieldType;
  Required: boolean;
  Order: number;
  Placeholder?: string;
  Options?: DynamicFormFieldOption[];
  MinLength?: number;
  MaxLength?: number;
  DefaultValue?: string;
}

export interface DynamicForm {
  Id: string;
  Title: string;
  Fields: DynamicFormField[];
  Status: FormStatus;
  CreatedAt: Date;
  UpdatedAt: Date;
  Description?: string;
}

export interface DynamicFormSubmission {
  FormId: string;
  Data: Record<string, unknown>;
  SubmittedAt?: Date;
}

export interface DynamicFormSubmissionResponse {
  Id: string;
  FormId: string;
  Data: Record<string, unknown>;
  SubmittedAt: Date;
  Status: SubmissionStatus;
}
