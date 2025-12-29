import { Injectable, signal } from '@angular/core';
import { Notification, NotificationStatus, NotificationType } from '@models/notification.model';
import { mockNotifications } from '@mocks/notification.mock';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications = signal<Notification[]>(mockNotifications);

  getNotifications(): Notification[] {
    return this.notifications();
  }

  getNotificationById(id: number): Notification | undefined {
    return this.notifications().find(notification => notification.id === id);
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications().filter(notification => notification.status === NotificationStatus.Unread);
  }

  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  markAsRead(id: number): void {
    const notifications = this.notifications();
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.status === NotificationStatus.Unread) {
      notification.status = NotificationStatus.Read;
      notification.readAt = new Date();
      this.notifications.set([...notifications]);
    }
  }

  markAllAsRead(): void {
    const notifications = this.notifications();
    const now = new Date();
    const updated = notifications.map(n => {
      if (n.status === NotificationStatus.Unread) {
        return { ...n, status: NotificationStatus.Read, readAt: now };
      }
      return n;
    });
    this.notifications.set(updated);
  }
  
  clearAllNotifications(): void {
    this.notifications.set([]);
  }

  markAsCompleted(id: number): void {
    const notifications = this.notifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.status = NotificationStatus.Completed;
      this.notifications.set([...notifications]);
    }
  }

  deleteNotification(id: number): void {
    const notifications = this.notifications().filter(n => n.id !== id);
    this.notifications.set(notifications);
  }

  handleAction(notificationId: number, actionType: string, data?: any): void {
    const notifications = this.notifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;

    this.markAsCompleted(notificationId);

    if (actionType === 'LINK_PLAYER' && data?.playerName) {
      const newNotification: Notification = {
        id: Math.max(...notifications.map(n => n.id)) + 1,
        type: NotificationType.Info,
        title: 'Player Linked',
        message: `${data.playerName} has been successfully linked to the database`,
        status: NotificationStatus.Unread,
        createdAt: new Date()
      };

      this.notifications.set([newNotification, ...notifications]);
    }
  }

  handleApproval(notificationId: number, approved: boolean): void {
    const notifications = this.notifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;

    if (approved) {
      this.markAsCompleted(notificationId);

      if (notification.user && notification.metadata?.teamName) {
        const newNotification: Notification = {
          id: Math.max(...notifications.map(n => n.id)) + 1,
          type: NotificationType.Info,
          title: 'Request Approved',
          message: `${notification.user.firstName} ${notification.user.lastName} is now the ${notification.metadata.teamName} coach`,
          status: NotificationStatus.Unread,
          createdAt: new Date(),
          userId: notification.userId,
          user: notification.user
        };

        this.notifications.set([newNotification, ...notifications]);
      }
    } else {
      notification.metadata = { ...notification.metadata, rejected: true };
      this.notifications.set([...notifications]);
    }
  }

  undoRejection(notificationId: number): void {
    const notifications = this.notifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification && notification.metadata?.rejected) {
      notification.status = NotificationStatus.Unread;
      const { rejected, ...restMetadata } = notification.metadata;
      notification.metadata = Object.keys(restMetadata).length > 0 ? restMetadata : undefined;
      this.notifications.set([...notifications]);
    }
  }

  removeRejectedNotifications(): void {
    const notifications = this.notifications();
    const filtered = notifications.filter(n => !n.metadata?.rejected);
    this.notifications.set(filtered);
  }
}
