import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService, ApiResponse } from '@core/services/api.service';
import {
  Notification,
  NotificationStatus,
  NotificationType,
  ApiGetNotificationsResponse,
  ApiNotificationSummary
} from '@models/notification.model';
import { ResolveNotificationRequest } from '@core/requests/notification.request';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly apiService = inject(ApiService);

  private readonly _notifications = signal<Notification[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);

  // Pagination state
  private _totalCount = 0;
  private _limit = 20;
  private _offset = 0;
  readonly hasMore = computed(() => this._notifications().length < this._totalCount);

  // ── Public read API ──────────────────────────────────────────────

  getNotifications(): Notification[] {
    return this._notifications();
  }

  getNotificationById(id: number): Notification | undefined {
    return this._notifications().find(n => n.id === id);
  }

  getUnreadNotifications(): Notification[] {
    return this._notifications().filter(n => n.status === NotificationStatus.Unread);
  }

  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  // ── API calls ────────────────────────────────────────────────────

  async loadNotifications(isRead?: boolean): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);
    this._offset = 0;

    try {
      const params: Record<string, string> = {
        limit: String(this._limit),
        offset: '0'
      };
      if (isRead !== undefined) params['isRead'] = String(isRead);

      const response = await firstValueFrom(
        this.apiService.get<ApiResponse<ApiGetNotificationsResponse>>('/notifications', { params })
      );

      if (response.success && response.data) {
        this._totalCount = response.data.totalCount;
        this._notifications.set(response.data.items.map(this.mapToNotification));
      }
    } catch {
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMore(): Promise<void> {
    if (!this.hasMore() || this.isLoading()) return;

    this._offset += this._limit;
    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.apiService.get<ApiResponse<ApiGetNotificationsResponse>>('/notifications', {
          params: { limit: String(this._limit), offset: String(this._offset) }
        })
      );

      if (response.success && response.data) {
        this._notifications.update(existing => [
          ...existing,
          ...response.data!.items.map(this.mapToNotification)
        ]);
      }
    } catch {
      this._offset -= this._limit; // rollback
    } finally {
      this.isLoading.set(false);
    }
  }

  async resolveNotification(id: number, request: ResolveNotificationRequest): Promise<void> {
    await firstValueFrom(this.apiService.put(`/notifications/${id}/resolve`, request));
    this.markAsCompleted(id);
  }

  async markAsRead(id: number): Promise<void> {
    // Optimistic update
    const notifications = this._notifications();
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.status !== NotificationStatus.Unread) return;

    notification.status = NotificationStatus.Read;
    notification.readAt = new Date();
    this._notifications.set([...notifications]);

    try {
      await firstValueFrom(this.apiService.put(`/notifications/${id}/read`, {}));
    } catch {
      // Rollback on error
      notification.status = NotificationStatus.Unread;
      notification.readAt = undefined;
      this._notifications.set([...notifications]);
    }
  }

  markAllAsRead(): void {
    const now = new Date();
    this._notifications.set(
      this._notifications().map(n =>
        n.status === NotificationStatus.Unread
          ? { ...n, status: NotificationStatus.Read, readAt: now }
          : n
      )
    );
  }

  clearAllNotifications(): void {
    this._notifications.set([]);
  }

  deleteNotification(id: number): void {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }

  // ── Existing action/approval methods (unchanged) ─────────────────

  markAsCompleted(id: number): void {
    const notifications = this._notifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.status = NotificationStatus.Completed;
      this._notifications.set([...notifications]);
    }
  }

  handleAction(notificationId: number, actionType: string, data?: any): void {
    const notifications = this._notifications();
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
      this._notifications.set([newNotification, ...notifications]);
    }
  }

  handleApproval(notificationId: number, approved: boolean): void {
    const notifications = this._notifications();
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
        this._notifications.set([newNotification, ...notifications]);
      }
    } else {
      notification.metadata = { ...notification.metadata, rejected: true };
      this._notifications.set([...notifications]);
    }
  }

  undoRejection(notificationId: number): void {
    const notifications = this._notifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.metadata?.rejected) {
      notification.status = NotificationStatus.Unread;
      const { rejected, ...rest } = notification.metadata;
      notification.metadata = Object.keys(rest).length > 0 ? rest : undefined;
      this._notifications.set([...notifications]);
    }
  }

  removeRejectedNotifications(): void {
    this._notifications.update(list => list.filter(n => !n.metadata?.rejected));
  }

  // ── Private mapper ───────────────────────────────────────────────

  private mapToNotification(item: ApiNotificationSummary): Notification {
    return {
      id: item.id,
      title: item.title,
      message: '',           // not present in summary — populated in detail view
      type: item.type as NotificationType,
      status: item.isRead ? NotificationStatus.Read : NotificationStatus.Unread,
      createdAt: new Date(item.createdAt),
      readAt: item.readAt ? new Date(item.readAt) : undefined,
      user: item.createdByUserName ? {
        id: 0,
        email: '',
        username: item.createdByUserName,
        avatarUrl: item.createdByAvatar
      } : undefined,
      metadata: {
        apiType: item.type,
        apiStatus: item.status,
        priority: item.priority,
        relatedEntityId: item.relatedEntityId,
        relatedEntityType: item.relatedEntityType
      }
    };
  }
}
