import { FormHeader } from '@core/models/form-header.model';
import { FormField } from '@core/models/form-field.model';

export interface FormDetail extends FormHeader {
  fields: FormField[];
}
