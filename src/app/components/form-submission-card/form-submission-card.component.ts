import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, createOutline, chatbubbleOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SubmissionDetailModalComponent } from '@components/modals/submission-detail-modal/submission-detail-modal.component';
import { FormSubmission } from '@core/models/form-submission.model';
import { FormField } from '@core/models/form-field.model';
import { AppStatus } from '@core/models/app-status.model';
import { latestComment } from '@core/utils/submission-comment.util';

export interface SubmissionTimelineStep {
  labelKey: string;
  icon: string;
  completed: boolean;
  isApproved?: boolean;
  isRejected?: boolean;
  connectorCompleted?: boolean;
}

@Component({
  selector: 'app-form-submission-card',
  templateUrl: './form-submission-card.component.html',
  styleUrls: ['./form-submission-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, SubmissionDetailModalComponent],
})
export class FormSubmissionCardComponent {
  readonly submission = input.required<FormSubmission>();
  readonly formFields = input.required<FormField[]>();

  readonly isModalOpen = signal(false);
  readonly editRequested = output<void>();

  readonly isRejected = computed(() => this.submission().status === AppStatus.Rejected);
  readonly rejectionComment = computed(() => latestComment(this.submission().comment));

  constructor() {
    addIcons({ documentTextOutline, createOutline, chatbubbleOutline });
  }

  readonly timelineSteps = computed<SubmissionTimelineStep[]>(() => {
    const status = this.submission().status as AppStatus;
    const isUnderReview = [AppStatus.Pending, AppStatus.Approved, AppStatus.Rejected].includes(status);
    const isFinal = status === AppStatus.Approved || status === AppStatus.Rejected;

    return [
      {
        labelKey: 'user.forms.submission.statusSubmitted',
        icon: 'checkmark-outline',
        completed: true,
        connectorCompleted: isUnderReview,
      },
      {
        labelKey: 'user.forms.submission.statusUnderReview',
        icon: isFinal ? 'checkmark-outline' : 'time-outline',
        completed: isUnderReview,
        connectorCompleted: isFinal,
      },
      {
        labelKey: status === AppStatus.Rejected
          ? 'user.forms.submission.statusRejected'
          : 'user.forms.submission.statusApproved',
        icon: status === AppStatus.Rejected ? 'close-outline' : 'checkmark-outline',
        completed: isFinal,
        isApproved: status === AppStatus.Approved,
        isRejected: status === AppStatus.Rejected,
      },
    ];
  });

  readonly statusBadgeClass = computed(() => {
    const status = this.submission().status as AppStatus;
    switch (status) {
      case AppStatus.Approved: return 'badge--approved';
      case AppStatus.Rejected: return 'badge--rejected';
      case AppStatus.Pending: return 'badge--review';
      default: return 'badge--submitted';
    }
  });

  readonly statusLabelKey = computed(() => {
    const status = this.submission().status as AppStatus;
    switch (status) {
      case AppStatus.Approved: return 'user.forms.submission.statusApproved';
      case AppStatus.Rejected: return 'user.forms.submission.statusRejected';
      case AppStatus.Pending: return 'user.forms.submission.statusUnderReview';
      default: return 'user.forms.submission.statusSubmitted';
    }
  });

  openDetail(): void {
    this.isModalOpen.set(true);
  }

  closeDetail(): void {
    this.isModalOpen.set(false);
  }
}
