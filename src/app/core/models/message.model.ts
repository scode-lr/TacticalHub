import { User } from './user.model';

export enum MessageStatus {
  Unread = 'unread',
  Read = 'read',
  Archived = 'archived'
}

export enum MessageOrigin {
  User = 'user',
  System = 'system',
  Admin = 'admin',
  Coach = 'coach',
  Team = 'team'
}

export enum MessagePriority {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Urgent = 'urgent'
}

export interface Message {
  id: number;
  senderId: number;
  sender: User;
  receiverId: number;
  receiver: User;
  subject: string;
  content: string;
  status: MessageStatus;
  priority: MessagePriority;
  origin: MessageOrigin;
  sentAt: Date;
  readAt?: Date;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
}
