import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shieldOutline, timeOutline, arrowForwardOutline, checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonAvatar,
    IonImg
  ]
})
export class ListCardComponent {
  readonly icon = input<string>('shield-outline');
  readonly avatarSrc = input<string | null>(null);
  readonly title = input.required<string>();
  readonly subtitleIcon = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly badgeText = input<string | null>(null);
  readonly selected = input<boolean | null>(null);
  readonly disabled = input<boolean>(false);
  readonly showArrow = input<boolean>(true);
  readonly listMode = input<boolean>(false);

  readonly cardClicked = output<void>();

  readonly avatarError = signal<boolean>(false);

  constructor() {
    addIcons({ shieldOutline, timeOutline, arrowForwardOutline, checkmarkOutline });
  }

  onAvatarError(): void {
    this.avatarError.set(true);
  }

  onClick(): void {
    if (!this.disabled()) {
      this.cardClicked.emit();
    }
  }
}
