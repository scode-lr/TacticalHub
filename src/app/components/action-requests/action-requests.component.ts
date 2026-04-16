import { Component, inject, computed, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NotificationsService } from '@core/services/notifications.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { Notification, NotificationType } from '@core/models';
import { SubmissionDetail } from '@core/responses/form.response';
import { ActionRequestsListModalComponent } from './action-requests-list-modal/action-requests-list-modal.component';
import { SubmissionReviewModalComponent } from './submission-review-modal/submission-review-modal.component';
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

  async handleApprove(): Promise<void> {
    await this.review(true);
  }

  async handleReject(): Promise<void> {
    await this.review(false);
  }

  private async review(approved: boolean): Promise<void> {
    const submission = this.selectedSubmission();
    const notification = this.selectedNotification();
    if (!submission || !notification || this.isReviewing()) return;

    this.isReviewing.set(true);
    try {
      await this.formSubmissionsService.reviewSubmission(submission.id, approved);
      this.notificationsService.markAsCompleted(notification.id);
      this.closeDetailModal();
    } finally {
      this.isReviewing.set(false);
    }
  }
}
