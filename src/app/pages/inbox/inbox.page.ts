import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonAvatar, IonImg, IonModal, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { InboxService } from '@core/services/inbox.service';
import { DefaultImageDirective } from "@core/directives";
import { Message } from '@core/models';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    IonImg,
    IonModal,
    IonIcon,
    TranslatePipe
  ]
})
export class InboxPage {
  private inboxService = inject(InboxService);
  
  readonly messages = computed(() => this.inboxService.getMessages());
  readonly isModalOpen = signal<boolean>(false);
  readonly selectedMessage = signal<Message | null>(null);

  constructor() {
    addIcons({ closeOutline });
  }

  openMessage(message: Message): void {
    this.selectedMessage.set(message);
    this.isModalOpen.set(true);
    if (message.status === 'unread') {
      this.inboxService.markAsRead(message.id);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    setTimeout(() => this.selectedMessage.set(null), 300);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
}
