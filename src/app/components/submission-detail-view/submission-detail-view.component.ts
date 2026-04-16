import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SubmissionDetail } from '@core/responses/form.response';
import { SubmissionValue } from '@core/models/submission-value.model';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle, ellipsisHorizontalCircle } from 'ionicons/icons';

export type FieldReviewState = 'ok' | 'nok' | null;

@Component({
  selector: 'app-submission-detail-view',
  templateUrl: './submission-detail-view.component.html',
  styleUrls: ['./submission-detail-view.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, CheckboxModule, IonIcon],
})
export class SubmissionDetailViewComponent {
  readonly submission = input.required<SubmissionDetail>();
  readonly fieldStatesChange = output<Record<number, FieldReviewState>>();

  fieldStates: Record<number, FieldReviewState> = {};

  constructor() {
    addIcons({ checkmarkCircle, closeCircle, ellipsisHorizontalCircle });
  }

  getDisplayValue(value: SubmissionValue): string {
    if (value.valueText !== null) return value.valueText;
    if (value.valueNumber !== null) return String(value.valueNumber);
    if (value.valueDate !== null) return value.valueDate;
    return '—';
  }

  toggleField(fieldId: number): void {
    const current = this.fieldStates[fieldId] ?? null;
    const next: FieldReviewState = current === null ? 'ok' : current === 'ok' ? 'nok' : null;
    this.fieldStates = { ...this.fieldStates, [fieldId]: next };
    this.fieldStatesChange.emit(this.fieldStates);
  }

  getFieldIcon(fieldId: number): string {
    const state = this.fieldStates[fieldId] ?? null;
    if (state === 'ok') return 'checkmark-circle';
    if (state === 'nok') return 'close-circle';
    return 'ellipsis-horizontal-circle';
  }
}
