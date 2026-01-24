import { Message, MessageStatus, MessagePriority, MessageOrigin } from '../app/core/models/message.model';
import { 
  mockAdminUser, 
  mockCoachUser, 
  mockPlayerUser, 
  mockPlayerUser2,
  mockPlayerUser3 
} from './user.mock';

export const mockMessage1: Message = {
  id: 1,
  senderId: mockCoachUser.id,
  sender: mockCoachUser,
  receiverId: mockPlayerUser.id,
  receiver: mockPlayerUser,
  subject: 'Training Session Tomorrow',
  content: 'Hi team, just a reminder that we have our training session scheduled for tomorrow at 10:00 AM. Please make sure to arrive 15 minutes early so we can start on time. We\'ll be focusing on tactical positioning and set pieces.',
  status: MessageStatus.Unread,
  priority: MessagePriority.Normal,
  origin: MessageOrigin.Coach,
  sentAt: new Date(Date.now() - 1000 * 60 * 30),
};

export const mockMessage2: Message = {
  id: 2,
  senderId: mockAdminUser.id,
  sender: mockAdminUser,
  receiverId: mockPlayerUser.id,
  receiver: mockPlayerUser,
  subject: 'Match Report Available',
  content: 'The detailed match report from last Saturday\'s game is now available. You can review your performance statistics and video highlights in the dashboard. Great work out there! Your passing accuracy was impressive at 87%.',
  status: MessageStatus.Unread,
  priority: MessagePriority.Normal,
  origin: MessageOrigin.System,
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
};

export const mockMessage3: Message = {
  id: 3,
  senderId: mockCoachUser.id,
  sender: mockCoachUser,
  receiverId: mockPlayerUser.id,
  receiver: mockPlayerUser,
  subject: 'Team Meeting Scheduled',
  content: 'We need to discuss the upcoming tournament strategy. Meeting scheduled for Friday at 3:00 PM in the conference room. Please review the opponent analysis document before the meeting.',
  status: MessageStatus.Read,
  priority: MessagePriority.High,
  origin: MessageOrigin.Coach,
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  readAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
};

export const mockMessage4: Message = {
  id: 4,
  senderId: mockPlayerUser2.id,
  sender: mockPlayerUser2,
  receiverId: mockPlayerUser.id,
  receiver: mockPlayerUser,
  subject: 'Equipment Check',
  content: 'Please verify your equipment before the next training session. If you need any replacements, contact the equipment manager by Wednesday. We want to make sure everyone has proper gear.',
  status: MessageStatus.Read,
  priority: MessagePriority.Low,
  origin: MessageOrigin.Team,
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  readAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
};

export const mockMessage5: Message = {
  id: 5,
  senderId: mockCoachUser.id,
  sender: mockCoachUser,
  receiverId: mockPlayerUser.id,
  receiver: mockPlayerUser,
  subject: 'Congratulations on Your Performance',
  content: 'Excellent work in last week\'s match! Your dedication and teamwork were outstanding. Keep up the great work and continue pushing yourself. The coaching staff has noticed your improvement.',
  status: MessageStatus.Read,
  priority: MessagePriority.Normal,
  origin: MessageOrigin.Coach,
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
};

export const mockMessage6: Message = {
  id: 6,
  senderId: mockAdminUser.id,
  sender: mockAdminUser,
  receiverId: mockPlayerUser.id,
  receiver: mockPlayerUser,
  subject: 'Important: Season Schedule Update',
  content: 'Due to weather conditions, we\'ve had to reschedule several matches. Please check the updated calendar in your dashboard. This affects the next three weeks of fixtures.',
  status: MessageStatus.Unread,
  priority: MessagePriority.Urgent,
  origin: MessageOrigin.Admin,
  sentAt: new Date(Date.now() - 1000 * 60 * 5),
};

export const mockMessage7: Message = {
  id: 7,
  senderId: mockPlayerUser3.id,
  sender: mockPlayerUser3,
  receiverId: mockPlayerUser.id,
  receiver: mockPlayerUser,
  subject: 'Recovery Session Invitation',
  content: 'Hey! A few of us are organizing a recovery session at the pool tomorrow. Interested in joining? It would be great for muscle recovery after the intense match.',
  status: MessageStatus.Read,
  priority: MessagePriority.Low,
  origin: MessageOrigin.User,
  sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
};

export const mockMessages: Message[] = [
  mockMessage1,
  mockMessage2,
  mockMessage3,
  mockMessage4,
  mockMessage5,
  mockMessage6,
  mockMessage7
];
