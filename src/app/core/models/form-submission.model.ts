export interface FormSubmission {
  id: number;
  formId: number;
  userId: number;
  userName: string;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  comment?: string | null;
}
