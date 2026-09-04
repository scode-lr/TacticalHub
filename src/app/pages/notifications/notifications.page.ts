import { Component, inject, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonAvatar, IonImg, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NotificationsService } from '@core/services/notifications.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { NavigationService } from '@core/services/navigation.service';
import { Notification, NotificationType } from '@core/models';
import { RoleType } from '@core/models/role.model';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar, IonImg, IonIcon, IonSpinner,
    TranslatePipe,
    EmptyStateComponent,
    UserHeaderComponent
  ]
})
export class NotificationsPage implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly navigationService = inject(NavigationService);

  readonly isLoading = this.notificationsService.isLoading;
  readonly hasError = this.notificationsService.hasError;
  readonly hasMore = this.notificationsService.hasMore;

  readonly notifications = computed(() =>
    this.notificationsService.getNotifications()
      .filter(n => n.type !== NotificationType.Approval && n.type !== NotificationType.Action)
  );
  readonly NotificationType = NotificationType;
  readonly defaultAvatar = 'assets/default-avatar.svg';

  readonly notificationGroups = computed<{ labelKey: string; items: Notification[] }[]>(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const thisWeek: Notification[] = [];
    const older: Notification[] = [];

    for (const notification of this.notifications()) {
      if (notification.createdAt >= startOfToday) today.push(notification);
      else if (notification.createdAt >= startOfYesterday) yesterday.push(notification);
      else if (notification.createdAt >= startOfWeek) thisWeek.push(notification);
      else older.push(notification);
    }

    return [
      { labelKey: 'notifications.today', items: today },
      { labelKey: 'notifications.yesterday', items: yesterday },
      { labelKey: 'notifications.thisWeek', items: thisWeek },
      { labelKey: 'notifications.older', items: older }
    ].filter(group => group.items.length > 0);
  });

  constructor() {
    addIcons({ checkmarkDoneOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.notificationsService.loadNotifications();
  }

  ngOnDestroy(): void {
    this.notificationsService.markAllAsRead();
  }

  async loadMore(): Promise<void> {
    await this.notificationsService.loadMore();
  }

  async markAllRead(): Promise<void> {
    await this.notificationsService.markAllAsRead();
  }


  // moments
  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  onAvatarError(event: Event): void {
    const img = (event.target as HTMLIonImgElement).shadowRoot?.querySelector('img');
    if (img) img.src = this.defaultAvatar;
  }

  async markAsRead(notification: Notification): Promise<void> {
    if (notification.status === 'unread') {
      this.notificationsService.markAsRead(notification.id);
    }
    await this.openRelatedEntity(notification);
  }

  private async openRelatedEntity(notification: Notification): Promise<void> {
    const relatedEntityType = notification.metadata?.relatedEntityType;
    const relatedEntityId = notification.metadata?.relatedEntityId;
    if (relatedEntityType !== 'FormSubmission' || !relatedEntityId) return;

    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    if (roleType !== RoleType.Member) return;

    try {
      const submission = await this.formSubmissionsService.getSubmission(relatedEntityId);
      this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'forms', submission.formId.toString()]);
    } catch {
      // notification is already marked as read; ignore navigation failure
    }
  }
}
