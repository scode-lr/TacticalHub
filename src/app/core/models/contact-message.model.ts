import { AppStatus } from './app-status.model';

export type ContactMessageType = 'general' | 'sponsor';
export type ContactMessageGlobalStatus = AppStatus.Active | AppStatus.Archived;
export type ContactMessageRecipientStatus = AppStatus.Pending | AppStatus.Active | AppStatus.Submitted;

export interface CreateContactMessage {
  type: ContactMessageType;
  subject: string;
  message: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export interface ContactMessageSummary {
  id: number;
  clubId: number;
  type: ContactMessageType;
  subject: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  globalStatus: ContactMessageGlobalStatus;
  recipientStatus: ContactMessageRecipientStatus;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
}

export interface ContactMessageDetail extends ContactMessageSummary {
  message: string;
  submittedByUserId?: number | null;
  submittedByName?: string | null;
  closedByUserId?: number | null;
  closedByName?: string | null;
  readAt?: string | null;
}

export interface ContactMessagesPage {
  items: ContactMessageSummary[];
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
