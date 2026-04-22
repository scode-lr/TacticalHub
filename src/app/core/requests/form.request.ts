export interface AddFormFieldRequest {
  key: string;
  label: string;
  description?: string | null;
  type: string;
  isRequired: boolean;
  maxLength?: number | null;
  order: number;
  options?: string[] | null;
  validationJson?: Record<string, unknown> | null;
}

export interface FormRequest {
  name: string;
  description?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  status?: string;
  action: string;
  email?: string | null;
  fields?: AddFormFieldRequest[];
}

export type CreateFormRequest = FormRequest & { clubId?: number };
export type UpdateFormRequest = FormRequest;

export interface SubmitFormRequest {
  values: Record<string, string | number | boolean | string[] | null>;
}

/** Alias kept for backward compatibility */
export type FormSubmissionRequest = SubmitFormRequest;
