import { AppStatus } from './app-status.model';
import { FormFieldType } from './form.model';

export interface SubmissionValue {
  id: number;
  fieldId: number;
  fieldKey: string;
  fieldLabel: string;
  fieldType: FormFieldType;
  valueText: string | null;
  valueNumber: number | null;
  valueDate: string | null;
  valueBoolean: boolean | null;
  status?: AppStatus | null;
}
