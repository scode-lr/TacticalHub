import { FormAction } from '@core/models/form-action.enum';
import { FormFieldType } from '@core/models/form-field.model';
import { AppStatus } from '@core/models/app-status.model';

export interface CreateFormFieldRequest {
  key: string;
  label: string;
  description: string | null;
  type: FormFieldType;
  isRequired: boolean;
  maxLength: number | null;
  order: number;
  options?: string[] | null;
  validationJson: Record<string, unknown> | null;
}

export interface CreateFormRequest {
  clubId: number;
  name: string;
  description: string | null;
  fromDate: string | null;
  toDate: string | null;
  status: AppStatus;
  action: FormAction;
  email: string | null;
  fields: CreateFormFieldRequest[];
}

export interface UpdateFormRequest {
  name?: string;
  description?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  status?: AppStatus;
  action?: FormAction;
  email?: string | null;
  fields?: CreateFormFieldRequest[];
}

export type FormFieldValue = string | number | boolean | string[];

export interface FormSubmissionRequest {
  values: Record<string, FormFieldValue>;
}
