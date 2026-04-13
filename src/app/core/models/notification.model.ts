import { User } from './user.model';

export enum NotificationType {
  Info = 'info',
  Action = 'submission_pending',
  Approval = 'approval'
}

export enum NotificationStatus {
  Unread = 'unread',
  Read = 'read',
  Completed = 'completed'
}

export interface NotificationAction {
  label: string;
  actionType: string;
  data?: any;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  userId?: number;
  user?: User;
  action?: NotificationAction;
  metadata?: any;
}

// --- API response types ---

export interface ApiNotificationSummary {
  id: number;
  title: string;
  type: string;          // 'submission_pending' | 'publication_request' | ...
  priority: string;      // 'H' | 'M' | 'L'
  status: string;        // 'P' | 'A' | 'R' | 'RS'
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface ApiGetNotificationsResponse {
  items: ApiNotificationSummary[];
  totalCount: number;
  limit: number;
  offset: number;
}
