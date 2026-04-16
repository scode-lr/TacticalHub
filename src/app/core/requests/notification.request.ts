import { AppStatus } from '@core/models/app-status.model';

export interface ResolveNotificationRequest {
  status: AppStatus;
  comment?: string;
  formId?: number;
  submissionId?: number;
  fieldStatuses?: Record<number, AppStatus>;
}
