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

import { RolesService } from '@services/roles.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly apiService = inject(ApiService);
  private readonly rolesService = inject(RolesService);

  private readonly _notifications = signal<Notification[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);
  private loadedRoleId: string | null = null;
  private loadingRoleId: string | null = null;
  private loadingPromise: Promise<void> | null = null;
  private loadRequestId = 0;

  // Pagination state
  private _totalCount = 0;
  private _limit = 20;
  private _offset = 0;
  readonly hasMore = computed(() => this._notifications().length < this._totalCount);

  private getUserClubRoleId(): string {
    return String(this.rolesService.getCurrentRole()?.id ?? '');
  }

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

  /**
   * Unread notifications shown in the notifications badge. Pending submissions are
   * excluded because they are surfaced in the forms section instead.
   */
  getUnreadCount(): number {
    return this.getUnreadNotifications().filter(n => !this.isSubmissionPending(n)).length;
  }

  /** Unread pending-submission notifications, badged on the forms menu item. */
  getPendingSubmissionsCount(): number {
    return this.getUnreadNotifications().filter(n => this.isSubmissionPending(n)).length;
  }

  private isSubmissionPending(notification: Notification): boolean {
    return (notification.metadata?.apiType ?? notification.type) === NotificationType.Action;
  }

  // ── API calls ────────────────────────────────────────────────────

  async loadNotifications(isRead?: boolean): Promise<void> {
    const roleId = this.getUserClubRoleId();
    if (!roleId) {
      this.clearAllNotifications();
      return;
    }

    if (isRead === undefined && this.loadedRoleId === roleId) {
      return;
    }

    if (isRead === undefined && this.loadingRoleId === roleId && this.loadingPromise) {
      await this.loadingPromise;
      return;
    }

    const requestId = ++this.loadRequestId;
    if (this.loadedRoleId !== roleId) {
      this._notifications.set([]);
      this._totalCount = 0;
      this._offset = 0;
    }

    this.isLoading.set(true);
    this.hasError.set(false);
    this._offset = 0;
    this.loadingRoleId = roleId;

    const loadPromise = this.fetchNotifications(roleId, requestId, isRead);
    this.loadingPromise = loadPromise;
    await loadPromise;
  }

  private async fetchNotifications(roleId: string, requestId: number, isRead?: boolean): Promise<void> {

    try {
      const params: Record<string, string> = {
        userClubRoleId: roleId,
        limit: String(this._limit),
        offset: '0'
      };
      if (isRead !== undefined) params['isRead'] = String(isRead);

      const response = await firstValueFrom(
        this.apiService.get<ApiResponse<ApiGetNotificationsResponse>>('/notifications', { params })
      );

      if (requestId === this.loadRequestId && response.success && response.data) {
        this._totalCount = response.data.totalCount;
        this._notifications.set(response.data.items.map(this.mapToNotification));
        this.loadedRoleId = isRead === undefined ? roleId : null;
      }
    } catch {
      if (requestId === this.loadRequestId) {
        this.hasError.set(true);
      }
    } finally {
      if (requestId === this.loadRequestId) {
        this.isLoading.set(false);
        this.loadingRoleId = null;
        this.loadingPromise = null;
      }
    }
  }

  async loadMore(): Promise<void> {
    if (!this.hasMore() || this.isLoading()) return;

    this._offset += this._limit;
    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.apiService.get<ApiResponse<ApiGetNotificationsResponse>>('/notifications', {
          params: { userClubRoleId: this.getUserClubRoleId(), limit: String(this._limit), offset: String(this._offset) }
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

  // Reviewing a form submission moved to FormSubmissionsService.reviewSubmission, which hits
  // PUT /forms/submissions/{id}/review and closes the linked notification server-side. Callers
  // update the local list with markAsCompleted afterwards.

  async markAsRead(id: number): Promise<void> {
    // Optimistic update
    const notifications = this._notifications();
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.status !== NotificationStatus.Unread) return;

    notification.status = NotificationStatus.Read;
    notification.readAt = new Date();
    this._notifications.set([...notifications]);

    try {
      await firstValueFrom(this.apiService.put(`/notifications/${id}/read`, {}, { params: { userClubRoleId: this.getUserClubRoleId() } }));
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
    this.loadRequestId++;
    this.loadedRoleId = null;
    this.loadingRoleId = null;
    this.loadingPromise = null;
    this._totalCount = 0;
    this._offset = 0;
    this.isLoading.set(false);
    this.hasError.set(false);
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

  // ── Private mapper ───────────────────────────────────────────────

  private mapToNotification(item: ApiNotificationSummary): Notification {
    return {
      id: item.id,
      title: item.title,
      message: item.message,
      type: item.type as NotificationType,
      status: item.isRead ? NotificationStatus.Read : NotificationStatus.Unread,
      createdAt: new Date(item.createdAt),
      readAt: item.readAt ? new Date(item.readAt) : undefined,
      user: item.createdByUserName ? {
        id: 0,
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
