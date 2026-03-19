import { FormHeader } from '@core/models/form-header.model';
import { FormField } from '@core/models/form-field.model';
import { AppStatus } from '@core/models/app-status.model';

export interface FormDetail extends FormHeader {
  fields: FormField[];
}

export interface FormSubmissionResult {
  submissionId: number;
  formId: number;
  userId: number;
  status: AppStatus;
  submittedAt: string;
}
