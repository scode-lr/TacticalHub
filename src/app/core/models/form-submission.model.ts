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
  /** Only populated by the club-wide submissions list, where rows are not already scoped to one form. */
  formName?: string | null;
}
