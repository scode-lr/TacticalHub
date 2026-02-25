import { FormAction, FormFieldType } from '../models/form.model';

export interface CreateFormRequest {
  name: string;
  description?: string;
  fromDate?: string;
  toDate?: string;
  action: FormAction;
}

export interface AddFormFieldRequest {
  key: string;
  label: string;
  description?: string;
  type: FormFieldType;
  isRequired: boolean;
  maxLength?: number;
  order: number;
  validationJson?: Record<string, unknown>;
}

export interface SubmitFormRequest {
  values: Record<string, string | number | boolean | null>;
}
