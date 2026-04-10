import { AppStatus } from './app-status.model';
import { FormAction } from './form-action.enum';

export interface FormHeader {
  id: number;
  name: string;
  description: string;
  clubId: number;
  fromDate: Date | null;
  toDate: Date | null;
  status: AppStatus;
  action: FormAction;
  email: string | null;
  settingsJson: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
