import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonModal } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NotificationsService } from '@core/services/notifications.service';
import { Notification, NotificationType } from '@core/models';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, closeOutline, linkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-action-requests',
  templateUrl: './action-requests.component.html',
  styleUrls: ['./action-requests.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonModal,
    TranslatePipe
  ]
})
export class ActionRequestsComponent {
  private notificationsService = inject(NotificationsService);
  
  readonly isModalOpen = signal<boolean>(false);
  
  readonly actionRequests = computed(() => 
    {
      console.log('Computing action requests...', this.notificationsService.getNotifications());
      return this.notificationsService.getNotifications()
        .filter(n => n.type === NotificationType.Action && n.status !== 'completed');
    });

  constructor() {
    addIcons({ chevronForwardOutline, closeOutline, linkOutline });
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
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
