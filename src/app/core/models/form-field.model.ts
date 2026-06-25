import { FormFieldType } from "./form.model";

export interface FormField {
  id: number;
  formId: number;
  key: string;
  label: string;
  description: string | null;
  type: FormFieldType;
  maxLength: number | null;
  isRequired: boolean;
  order: number;
  validationJson: unknown | null;
  createdAt: Date;
  status?: string;
  options: string[] | null;
}
