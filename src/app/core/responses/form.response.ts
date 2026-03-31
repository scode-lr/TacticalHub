import { FormHeader } from '@core/models/form-header.model';
import { FormField } from '@core/models/form-field.model';
import { AppStatus } from '@core/models/app-status.model';
import { FormSubmission } from '@core/models/form-submission.model';
import { SubmissionValue } from '@core/models/submission-value.model';

export interface FormDetail extends FormHeader {
  fields?: FormField[];
  submissionsCount?: number;
}


export interface FormSubmissionResult {
  submissionId: number;
  formId: number;
  userId: number;
  status: AppStatus;
  submittedAt: string;
}

export type SubmissionSummary = FormSubmission;

export type SubmissionValueEntry = SubmissionValue;

export interface SubmissionDetail extends FormSubmission {
  values: SubmissionValue[];
}

export interface SubmissionPage {
  submissions: FormSubmission[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface FormsPage {
  forms: FormDetail[];
  totalCount: number;
  page: number;
  pageSize: number;
}
