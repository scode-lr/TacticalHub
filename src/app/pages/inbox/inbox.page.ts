import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonAvatar, IonImg, IonModal, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { formatDistanceToNow, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { ca } from 'date-fns/locale/ca';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { InboxService } from '@core/services/inbox.service';
import { ContactMessageDetail, ContactMessageSummary } from '@core/models/contact-message.model';
import { AppStatus } from '@core/models/app-status.model';
import { TranslationService } from '@core/services/i18n/translation.service';
import { DefaultImageDirective } from '@core/directives';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline, closeOutline, mailOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
  standalone: true,
  imports: [CommonModule, IonAvatar, IonImg, IonModal, IonIcon, IonSpinner, TranslatePipe, DefaultImageDirective]
})
export class InboxPage implements OnInit {
  private readonly inboxService = inject(InboxService);
  private readonly translationService = inject(TranslationService);

  readonly messages = computed(() => this.inboxService.getMessages());
  readonly loading = this.inboxService.loading;
  readonly isModalOpen = signal(false);
  readonly selectedMessage = signal<ContactMessageDetail | null>(null);
  protected readonly appStatus = AppStatus;
  protected readonly defaultAvatar = 'assets/default-avatar.svg';
  protected readonly fallbackImage = 'assets/image-non-available.svg';

  constructor() {
    addIcons({ checkmarkDoneOutline, closeOutline, mailOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.inboxService.loadMessages();
  }

  async openMessage(message: ContactMessageSummary): Promise<void> {
    const detail = await this.inboxService.openMessage(message);
    this.selectedMessage.set(detail);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedMessage.set(null);
  }

  async closeMessage(): Promise<void> {
    const message = this.selectedMessage();
    if (!message || message.globalStatus === AppStatus.Archived) return;
    this.selectedMessage.set(await this.inboxService.closeMessage(message.id));
  }

  workflowStatus(message: ContactMessageSummary): AppStatus {
    return message.globalStatus === AppStatus.Archived ? AppStatus.Archived : AppStatus.Active;
  }

  workflowHintKey(message: ContactMessageSummary): string {
    if (message.globalStatus === AppStatus.Archived) return 'contactMessages.workflow.closedHint';
    return 'contactMessages.workflow.openHint';
  }

  formatDate(date: string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: this.getLocale() });
  }

  private getLocale(): Locale {
    const lang = this.translationService.getCurrentLanguage();
    switch (lang) {
      case 'es': return es;
      case 'ca': return ca;
      default: return enUS;
    }
  }
}
