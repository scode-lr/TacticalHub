import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonModal, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Notification } from '@core/models';
import { SubmissionDetail } from '@core/responses/form.response';
import { SubmissionDetailViewComponent, FieldReviewState } from '@components/submission-detail-view/submission-detail-view.component';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline, closeCircleOutline } from 'ionicons/icons';

export interface ReviewResult {
  comment: string;
  fieldStates: Record<number, FieldReviewState>;
}

@Component({
  selector: 'app-submission-review-modal',
  templateUrl: './submission-review-modal.component.html',
  styleUrls: ['./submission-review-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonModal, IonSpinner, TranslatePipe, SubmissionDetailViewComponent]
})
export class SubmissionReviewModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly notification = input<Notification | null>(null);
  readonly submission = input<SubmissionDetail | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly isReviewing = input<boolean>(false);

  readonly dismissed = output<void>();
  readonly approved = output<ReviewResult>();
  readonly rejected = output<ReviewResult>();

  comment = '';
  readonly fieldStates = signal<Record<number, FieldReviewState>>({});

  constructor() {
    addIcons({ closeOutline, checkmarkOutline, closeCircleOutline });
  }

  onFieldStatesChange(states: Record<number, FieldReviewState>): void {
    this.fieldStates.set(states);
  }
}
