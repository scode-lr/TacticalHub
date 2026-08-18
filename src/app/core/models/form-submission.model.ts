export interface FormSubmission {
  id: number;
  formId: number;
  userId: number;
  userName: string;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  comment?: string | null;
  /** Set when a signed document has been issued for this submission. */
  documentId?: number | null;
}
