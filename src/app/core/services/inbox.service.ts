import { Injectable, signal } from '@angular/core';
import { Message, MessageStatus } from '@models/message.model';
import { mockMessages } from '@mocks/message.mock';

@Injectable({
  providedIn: 'root'
})
export class InboxService {
  private messages = signal<Message[]>(mockMessages);

  getMessages(): Message[] {
    return this.messages();
  }

  getMessageById(id: number): Message | undefined {
    return this.messages().find(message => message.id === id);
  }

  getUnreadMessages(): Message[] {
    return this.messages().filter(message => message.status === MessageStatus.Unread);
  }

  getUnreadCount(): number {
    return this.getUnreadMessages().length;
  }

  markAsRead(id: number): void {
    const messages = this.messages();
    const message = messages.find(m => m.id === id);
    if (message && message.status === MessageStatus.Unread) {
      message.status = MessageStatus.Read;
      message.readAt = new Date();
      this.messages.set([...messages]);
    }
  }

  markAsUnread(id: number): void {
    const messages = this.messages();
    const message = messages.find(m => m.id === id);
    if (message) {
      message.status = MessageStatus.Unread;
      message.readAt = undefined;
      this.messages.set([...messages]);
    }
  }

  archiveMessage(id: number): void {
    const messages = this.messages();
    const message = messages.find(m => m.id === id);
    if (message) {
      message.status = MessageStatus.Archived;
      this.messages.set([...messages]);
    }
  }

  deleteMessage(id: number): void {
    const messages = this.messages().filter(m => m.id !== id);
    this.messages.set(messages);
  }
}
