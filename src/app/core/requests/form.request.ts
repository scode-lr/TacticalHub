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
  requiresSignature?: boolean;
  requiresReview?: boolean;
  adultsOnly?: boolean;
  generatesDocument?: boolean;
  fields?: AddFormFieldRequest[];
}

export type CreateFormRequest = FormRequest & { clubId?: number };
export type UpdateFormRequest = FormRequest;

export interface FormSignatureRequest {
  /** PNG data URL produced by the signature pad. */
  dataUrl: string;
  widthPx?: number;
  heightPx?: number;
}

export interface SubmitFormRequest {
  values: Record<string, string | number | boolean | string[] | null>;
  /** Required when the form requires a signature. */
  signature?: FormSignatureRequest;
}

/** Alias kept for backward compatibility */
export type FormSubmissionRequest = SubmitFormRequest;

export interface ReviewSubmissionRequest {
  approved: boolean;
  comment?: string | null;
  fieldStatuses?: Record<number, string>;
}
