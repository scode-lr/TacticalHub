import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonModal, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NotificationsService } from '@core/services/notifications.service';
import { Notification, NotificationType } from '@core/models';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, closeOutline, checkmarkOutline, peopleOutline, arrowUndoOutline } from 'ionicons/icons';

@Component({
  selector: 'app-team-join-requests',
  templateUrl: './team-join-requests.component.html',
  styleUrls: ['./team-join-requests.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonModal,
    IonAvatar,
    IonImg,
    TranslatePipe
  ]
})
export class TeamJoinRequestsComponent {
  private notificationsService = inject(NotificationsService);
  
  readonly isModalOpen = signal<boolean>(false);
  
  readonly approvalRequests = computed(() => 
    this.notificationsService.getNotifications()
      .filter(n => n.type === NotificationType.Approval && n.status !== 'completed')
  );

  constructor() {
    addIcons({ chevronForwardOutline, closeOutline, checkmarkOutline, peopleOutline, arrowUndoOutline });
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  handleApprove(notification: Notification): void {
    this.notificationsService.handleApproval(notification.id, true);
  }

  handleReject(notification: Notification): void {
    this.notificationsService.handleApproval(notification.id, false);
  }

  handleUndo(notification: Notification): void {
    this.notificationsService.undoRejection(notification.id);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
}
