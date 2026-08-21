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
  /** The member must sign the form digitally before it can be submitted. */
  requiresSignature: boolean;
  /** Coordination must approve the submission before it counts as accepted. */
  requiresReview: boolean;
  /** Only members of legal age can see and fill in the form. */
  adultsOnly: boolean;
  /** An accepted submission produces a downloadable PDF. Always true when signed. */
  generatesDocument: boolean;
  settingsJson: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
