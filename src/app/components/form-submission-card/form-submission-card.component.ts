import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SubmissionDetailModalComponent } from '@components/modals/submission-detail-modal/submission-detail-modal.component';
import { FormSubmission } from '@core/models/form-submission.model';
import { FormField } from '@core/models/form-field.model';
import { AppStatus } from '@core/models/app-status.model';

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

  constructor() {
    addIcons({ documentTextOutline });
  }

  readonly timelineSteps = computed<SubmissionTimelineStep[]>(() => {
    const status = this.submission().status as AppStatus;
    const isUnderReview = [AppStatus.Pending, AppStatus.Approved, AppStatus.Rejected].includes(status);
    const isFinal = status === AppStatus.Approved || status === AppStatus.Rejected;

    return [
      {
        labelKey: 'viewer.forms.submission.statusSubmitted',
        icon: 'checkmark-outline',
        completed: true,
        connectorCompleted: isUnderReview,
      },
      {
        labelKey: 'viewer.forms.submission.statusUnderReview',
        icon: isFinal ? 'checkmark-outline' : 'time-outline',
        completed: isUnderReview,
        connectorCompleted: isFinal,
      },
      {
        labelKey: status === AppStatus.Rejected
          ? 'viewer.forms.submission.statusRejected'
          : 'viewer.forms.submission.statusApproved',
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
      case AppStatus.Approved: return 'viewer.forms.submission.statusApproved';
      case AppStatus.Rejected: return 'viewer.forms.submission.statusRejected';
      case AppStatus.Pending: return 'viewer.forms.submission.statusUnderReview';
      default: return 'viewer.forms.submission.statusSubmitted';
    }
  });

  openDetail(): void {
    this.isModalOpen.set(true);
  }

  closeDetail(): void {
    this.isModalOpen.set(false);
  }
}
