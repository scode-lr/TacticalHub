import { Injectable, signal } from '@angular/core';
import { FormField } from '@core/models/form-field.model';

export interface FormSignatureDraft {
  formId: number;
  /** -1 for a brand new submission, otherwise the submission being re-sent. */
  submissionId: number;
  formName: string;
  formDescription: string | null;
  fields: FormField[];
  values: Record<string, string | number | boolean | string[] | null>;
  /** Where the member entered the form from, so returning to it keeps the same way out. */
  from: 'forms' | 'detail';
}

/**
 * Carries the filled-in answers from the form page to the signature page.
 *
 * Held in a service rather than router state so the two screens stay decoupled; the draft is
 * deliberately not persisted, so a page reload sends the user back to the form to fill it again.
 */
@Injectable({ providedIn: 'root' })
export class FormSignatureDraftService {
  private readonly _draft = signal<FormSignatureDraft | null>(null);

  readonly draft = this._draft.asReadonly();

  set(draft: FormSignatureDraft): void {
    this._draft.set(draft);
  }

  get(): FormSignatureDraft | null {
    return this._draft();
  }

  clear(): void {
    this._draft.set(null);
  }
}
