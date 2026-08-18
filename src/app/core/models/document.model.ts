/**
 * A document issued from an approved, signed form submission.
 *
 * The API never exposes a storage key or URL: the file is only reachable through the authenticated
 * download endpoint.
 */
export interface FormDocument {
  id: number;
  submissionId: number;
  formId: number;
  formName: string;
  clubId: number;
  documentType: string;
  reference: string;
  verificationCode: string;
  fileName: string;
  status: string;
  generatedAt: string;
  approvedAt: string | null;
}

export interface DocumentsPage {
  documents: FormDocument[];
  limit: number;
  offset: number;
  totalCount: number;
}
