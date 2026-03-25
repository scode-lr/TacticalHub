export interface FormSubmission {
  id: number;
  formId: number;
  userId: number;
  status: string;
  submittedAt: string | null;
  createdAt: string;
}
