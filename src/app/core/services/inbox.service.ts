import { Injectable, computed, inject, signal } from '@angular/core';
import { AppStatus } from '@core/models/app-status.model';
import { ContactMessageDetail, ContactMessageSummary } from '@core/models/contact-message.model';
import { ClubService } from './club.service';
import { ContactMessageService } from './contact-message.service';
import { NavigationService } from './navigation.service';

@Injectable({ providedIn: 'root' })
export class InboxService {
  private readonly clubService = inject(ClubService);
  private readonly contactMessageService = inject(ContactMessageService);
  private readonly navigationService = inject(NavigationService);

  private readonly messages = signal<ContactMessageSummary[]>([]);
  readonly loading = signal(false);
  readonly unreadCount = computed(() => this.messages().filter(message => message.recipientStatus === AppStatus.Pending).length);

  private readonly limit = 50;

  getMessages(): ContactMessageSummary[] {
    return this.messages();
  }

  getUnreadCount(): number {
    return this.unreadCount();
  }

  async loadMessages(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    const userClubRoleId = this.navigationService.extractRoleDetails().roleId;
    if (!clubId || !userClubRoleId || this.loading()) return;

    this.loading.set(true);
    try {
      const page = await this.contactMessageService.getForCoordinator(clubId, userClubRoleId, this.limit, 0);
      this.messages.set(page.items);
    } finally {
      this.loading.set(false);
    }
  }

  async openMessage(message: ContactMessageSummary): Promise<ContactMessageDetail> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    const userClubRoleId = this.navigationService.extractRoleDetails().roleId;
    let detail = await this.contactMessageService.getById(clubId, message.id, userClubRoleId);

    if (detail.recipientStatus === AppStatus.Pending && detail.globalStatus !== AppStatus.Archived) {
      detail = await this.contactMessageService.markAsRead(clubId, message.id, userClubRoleId);
      this.patchMessage(detail);
    }

    return detail;
  }

  async markInProgress(messageId: number): Promise<ContactMessageDetail> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    const userClubRoleId = this.navigationService.extractRoleDetails().roleId;
    const updated = await this.contactMessageService.updateRecipientStatus(clubId, messageId, userClubRoleId, AppStatus.Submitted);
    this.patchMessage(updated);
    return updated;
  }

  async closeMessage(messageId: number): Promise<ContactMessageDetail> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    const userClubRoleId = this.navigationService.extractRoleDetails().roleId;
    const updated = await this.contactMessageService.close(clubId, messageId, userClubRoleId);
    this.patchMessage(updated);
    return updated;
  }

  private patchMessage(updated: ContactMessageDetail): void {
    this.messages.update(messages => messages.map(message => message.id === updated.id ? { ...message, ...updated } : message));
  }
}
