import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  IonAvatar, IonImg } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { InboxService } from '@core/services/inbox.service';
import { DefaultImageDirective } from "@core/directives";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    TranslatePipe,
    IonImg,
    DefaultImageDirective
]
})
export class InboxPage {
  private inboxService = inject(InboxService);
  
  readonly messages = computed(() => this.inboxService.getMessages());

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
