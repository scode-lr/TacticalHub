import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Notification } from '@core/models';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, closeOutline, documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-action-requests-list-modal',
  templateUrl: './action-requests-list-modal.component.html',
  styleUrls: ['./action-requests-list-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, TranslatePipe]
})
export class ActionRequestsListModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly requests = input.required<Notification[]>();

  readonly dismissed = output<void>();
  readonly requestSelected = output<Notification>();

  constructor() {
    addIcons({ chevronForwardOutline, closeOutline, documentTextOutline });
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
