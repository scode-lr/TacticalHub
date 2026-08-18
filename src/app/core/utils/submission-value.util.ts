import { SubmissionValue } from '@core/models/submission-value.model';

type StoredBoolean = Pick<SubmissionValue, 'valueBoolean' | 'valueText'>;

/**
 * Reads the yes/no answer out of a stored submission value.
 *
 * The API mapped boolean fields onto the wrong type name for a long time, so submissions made
 * before that fix carry the answer as the text "true"/"false" with `valueBoolean` left null.
 * Both shapes have to be understood until those rows are gone.
 *
 * Returns null when the value is not a yes/no answer at all — a boolean field with authored
 * options answers with the option text, which belongs to the caller to display as-is.
 */
export function readBooleanValue(value: StoredBoolean): boolean | null {
  if (value.valueBoolean !== null && value.valueBoolean !== undefined) return value.valueBoolean;

  switch (value.valueText?.trim().toLowerCase()) {
    case 'true': return true;
    case 'false': return false;
    default: return null;
  }
}
