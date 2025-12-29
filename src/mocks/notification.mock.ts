import { Notification, NotificationType, NotificationStatus } from '../app/core/models/notification.model';
import { mockPlayerUser, mockPlayerUser2, mockCoachUser } from './user.mock';

export const mockNotification1: Notification = {
  id: 1,
  type: NotificationType.Info,
  title: 'New Membership',
  message: 'Pep became a new membership!',
  status: NotificationStatus.Unread,
  createdAt: new Date(Date.now() - 1000 * 60 * 15),
  userId: mockPlayerUser.id,
  user: mockPlayerUser
};

export const mockNotification2: Notification = {
  id: 2,
  type: NotificationType.Action,
  title: 'New Player Registration',
  message: 'A new player has registered and needs to be linked to the database.',
  status: NotificationStatus.Unread,
  createdAt: new Date(Date.now() - 1000 * 60 * 45),
  action: {
    label: 'Link Player',
    actionType: 'LINK_PLAYER',
    data: { playerId: 1, playerName: 'Marc Torres' }
  }
};

export const mockNotification3: Notification = {
  id: 3,
  type: NotificationType.Approval,
  title: 'Coach Request',
  message: 'Jaume wants to be the Juvenil coach',
  status: NotificationStatus.Unread,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  userId: mockCoachUser.id,
  user: mockCoachUser,
  metadata: { teamName: 'Juvenil', roleId: 2 }
};

export const mockNotification4: Notification = {
  id: 4,
  type: NotificationType.Info,
  title: 'Match Result',
  message: 'Juvenil B won against FC Barcelona 3-2!',
  status: NotificationStatus.Read,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  readAt: new Date(Date.now() - 1000 * 60 * 60 * 20)
};

export const mockNotification5: Notification = {
  id: 5,
  type: NotificationType.Info,
  title: 'Training Equipment',
  message: 'New training equipment has arrived. Review and update inventory.',
  status: NotificationStatus.Read,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  readAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
};

export const mockNotification6: Notification = {
  id: 6,
  type: NotificationType.Approval,
  title: 'Team Join Request',
  message: 'Sarah wants to join Alevin B team',
  status: NotificationStatus.Unread,
  createdAt: new Date(Date.now() - 1000 * 60 * 30),
  userId: mockPlayerUser2.id,
  user: mockPlayerUser2,
  metadata: { teamName: 'Alevin B', teamId: 3 }
};

export const mockNotification7: Notification = {
  id: 7,
  type: NotificationType.Info,
  title: 'Training Cancelled',
  message: 'Tomorrow\'s training session has been cancelled due to weather conditions.',
  status: NotificationStatus.Unread,
  createdAt: new Date(Date.now() - 1000 * 60 * 10),
};

export const mockNotification8: Notification = {
  id: 8,
  type: NotificationType.Action,
  title: 'Post Approval Request',
  message: 'Pep wants to publish a post about the recent team victory',
  status: NotificationStatus.Unread,
  createdAt: new Date(Date.now() - 1000 * 60 * 25),
  userId: mockPlayerUser.id,
  user: mockPlayerUser,
  action: {
    label: 'Review Post',
    actionType: 'REVIEW_POST',
    data: { postId: 555, postTitle: 'Team Victory Celebration', userName: 'Pep' }
  }
};

export const mockNotifications: Notification[] = [
  mockNotification1,
  mockNotification2,
  mockNotification3,
  mockNotification4,
  mockNotification5,
  mockNotification6,
  mockNotification7,
  mockNotification8
];
