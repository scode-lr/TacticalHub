import { Component, inject, computed, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NotificationsService } from '@core/services/notifications.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { Notification, NotificationType } from '@core/models';
import { AppStatus } from '@core/models/app-status.model';
import { ResolveNotificationRequest } from '@core/requests/notification.request';
import { SubmissionDetail } from '@core/responses/form.response';
import { ActionRequestsListModalComponent } from './action-requests-list-modal/action-requests-list-modal.component';
import { SubmissionReviewModalComponent, ReviewResult } from './submission-review-modal/submission-review-modal.component';
import { FieldReviewState } from '@components/submission-detail-view/submission-detail-view.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-action-requests',
  templateUrl: './action-requests.component.html',
  styleUrls: ['./action-requests.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    TranslatePipe,
    ActionRequestsListModalComponent,
    SubmissionReviewModalComponent
  ]
})
export class ActionRequestsComponent {
  private readonly notificationsService = inject(NotificationsService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);

  readonly isListModalOpen = signal<boolean>(false);
  readonly isDetailModalOpen = signal<boolean>(false);
  readonly selectedNotification = signal<Notification | null>(null);
  readonly selectedSubmission = signal<SubmissionDetail | null>(null);
  readonly isDetailLoading = signal<boolean>(false);
  readonly isReviewing = signal<boolean>(false);

  readonly actionRequests = computed(() =>
    this.notificationsService.getNotifications()
      .filter(n => n.type === NotificationType.Action && n.status !== 'completed')
  );

  constructor() {
    addIcons({ chevronForwardOutline, documentTextOutline });
  }

  openListModal(): void {
    this.isListModalOpen.set(true);
  }

  closeListModal(): void {
    this.isListModalOpen.set(false);
  }

  async openDetail(notification: Notification): Promise<void> {
    const submissionId = notification.metadata?.relatedEntityId;
    if (!submissionId) return;

    this.selectedNotification.set(notification);
    this.selectedSubmission.set(null);
    this.isDetailModalOpen.set(true);
    this.isDetailLoading.set(true);

    try {
      const submission = await this.formSubmissionsService.getSubmission(submissionId);
      this.selectedSubmission.set(submission);
    } finally {
      this.isDetailLoading.set(false);
    }
  }

  closeDetailModal(): void {
    this.isDetailModalOpen.set(false);
    this.selectedNotification.set(null);
    this.selectedSubmission.set(null);
  }

  async handleApprove(result: ReviewResult): Promise<void> {
    await this.review(true, result.comment, result.fieldStates);
  }

  async handleReject(result: ReviewResult): Promise<void> {
    await this.review(false, result.comment, result.fieldStates);
  }

  private async review(approved: boolean, comment: string, fieldStates: Record<number, FieldReviewState>): Promise<void> {
    const submission = this.selectedSubmission();
    const notification = this.selectedNotification();
    if (!submission || !notification || this.isReviewing()) return;

    const fieldStatuses: Record<number, AppStatus> = {};
    for (const [id, state] of Object.entries(fieldStates)) {
      if (state === 'ok') fieldStatuses[+id] = AppStatus.Approved;
      else if (state === 'nok') fieldStatuses[+id] = AppStatus.Rejected;
    }

    const request: ResolveNotificationRequest = {
      status: approved ? AppStatus.Approved : AppStatus.Rejected,
      comment: comment || undefined,
      formId: submission.formId,
      submissionId: submission.id,
      ...(Object.keys(fieldStatuses).length > 0 && { fieldStatuses })
    };

    this.isReviewing.set(true);
    try {
      await this.notificationsService.resolveNotification(notification.id, request);
      this.closeDetailModal();
    } finally {
      this.isReviewing.set(false);
    }
  }
}
