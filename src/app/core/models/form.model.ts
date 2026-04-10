import { AppStatus } from "./app-status.model";

export enum FormAction {
  None = 'none',
  RegisterUser = 'register_user',
  CreatePayment = 'create_payment',
  TriggerWorkflow = 'trigger_workflow'
}

export enum FormFieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Select = 'select',
  Checkbox = 'checkbox'
}


export interface Form {
  id: number;
  name: string;
  description?: string;
  clubId: number;
  fromDate?: string;
  toDate?: string;
  status: AppStatus;
  action: FormAction;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  fields?: FormField[];
}

export interface FormField {
  id: number;
  formId: number;
  key: string;
  label: string;
  description?: string;
  type: FormFieldType;
  isRequired: boolean;
  maxLength?: number;
  order: number;
  validationJson?: Record<string, unknown>;
  createdAt: string;
}

export interface FormSubmission {
  id: number;
  formId: number;
  userId: number;
  status: AppStatus;
  submittedAt?: string;
  createdAt: string;
  values?: FormSubmissionValue[];
}

export interface FormSubmissionValue {
  id: number;
  submissionId: number;
  fieldId: number;
  field?: FormField;
  valueText?: string;
  valueNumber?: number;
  valueDate?: string;
  valueBoolean?: boolean;
}
