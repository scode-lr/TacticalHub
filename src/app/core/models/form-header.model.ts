import { AppStatus } from './app-status.model';

export interface FormHeader {
  id: number;
  name: string;
  description: string;
  clubId: number;
  fromDate: Date;
  toDate: Date;
  status: AppStatus;
  action: string;
  settingsJson: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
