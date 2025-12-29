import { User } from './user.model';

export enum NotificationType {
  Info = 'info',
  Action = 'action',
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
