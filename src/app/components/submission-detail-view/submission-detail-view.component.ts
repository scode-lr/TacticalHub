import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SubmissionDocumentComponent } from '@components/submission-document/submission-document.component';
import { SubmissionDetail } from '@core/responses/form.response';
import { SubmissionValue } from '@core/models/submission-value.model';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import { maskIban } from '@core/utils/iban.util';
import { readBooleanValue } from '@core/utils/submission-value.util';
import { FormFieldType } from '@core/models/form.model';

export type FieldReviewState = 'ok' | 'nok' | null;

@Component({
  selector: 'app-submission-detail-view',
  templateUrl: './submission-detail-view.component.html',
  styleUrls: ['./submission-detail-view.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, CheckboxModule, IonIcon, SubmissionDocumentComponent],
})
export class SubmissionDetailViewComponent implements OnChanges {
  readonly submission = input.required<SubmissionDetail>();
  readonly reviewMode = input<boolean>(false);
  readonly fieldStatesChange = output<Record<number, FieldReviewState>>();

  fieldStates: Record<number, FieldReviewState> = {};

  constructor() {
    addIcons({ checkmarkOutline, closeOutline });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['submission']) this.fieldStates = {};
  }

  booleanValue(value: SubmissionValue): boolean | null {
    return readBooleanValue(value);
  }

  getDisplayValue(value: SubmissionValue): string {
    if (value.fieldType === FormFieldType.Iban) return maskIban(value.valueText);
    if (value.valueText !== null) return value.valueText;
    if (value.valueNumber !== null) return String(value.valueNumber);
    if (value.valueDate !== null) return value.valueDate;
    return '—';
  }

  /** Each button sets its own state; clicking the already-active one clears it back to unset. */
  setFieldState(fieldId: number, state: 'ok' | 'nok'): void {
    const current = this.fieldStates[fieldId] ?? null;
    const next: FieldReviewState = current === state ? null : state;
    this.fieldStates = { ...this.fieldStates, [fieldId]: next };
    this.fieldStatesChange.emit(this.fieldStates);
  }
}
