import { FormAction } from '@core/models/form-action.enum';
import { FormFieldType } from '@core/models/form-field.model';

export interface CreateFormFieldRequest {
  key: string;
  label: string;
  description: string | null;
  type: FormFieldType;
  isRequired: boolean;
  maxLength: number | null;
  order: number;
  validationJson: Record<string, unknown> | null;
}

export interface CreateFormRequest {
  clubId: number;
  name: string;
  description: string | null;
  fromDate: string | null;
  toDate: string | null;
  action: FormAction;
  fields: CreateFormFieldRequest[];
}

export interface UpdateFormRequest {
  name?: string;
  description?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  action?: FormAction;
  fields?: CreateFormFieldRequest[];
}
