import { Component, inject, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonAvatar, IonImg, IonIcon, IonButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NotificationsService } from '@core/services/notifications.service';
import { Notification, NotificationType } from '@core/models';
import { TeamJoinRequestsComponent } from '@components/team-join-requests/team-join-requests.component';
import { ActionRequestsComponent } from '@components/action-requests/action-requests.component';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    IonImg,
    IonIcon,
    IonButton,
    TranslatePipe,
    TeamJoinRequestsComponent,
    ActionRequestsComponent
  ]
})
export class NotificationsPage implements OnDestroy {
  private notificationsService = inject(NotificationsService);
  
  readonly notifications = computed(() => 
    this.notificationsService.getNotifications()
      .filter(n => n.type !== NotificationType.Approval && n.type !== NotificationType.Action)
  );
  readonly NotificationType = NotificationType;

  constructor() {
    addIcons({ checkmarkOutline, closeOutline });
  }

  ngOnDestroy(): void {
    this.notificationsService.removeRejectedNotifications();
    this.notificationsService.markAllAsRead();
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

  handleAction(notification: Notification): void {
    if (notification.action) {
      this.notificationsService.handleAction(
        notification.id, 
        notification.action.actionType, 
        notification.action.data
      );
    }
  }

  handleApprove(notification: Notification): void {
    this.notificationsService.handleApproval(notification.id, true);
  }

  handleReject(notification: Notification): void {
    this.notificationsService.handleApproval(notification.id, false);
  }

  markAsRead(notification: Notification): void {
    if (notification.status === 'unread') {
      this.notificationsService.markAsRead(notification.id);
    }
  }
}
