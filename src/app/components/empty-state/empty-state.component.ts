import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { notificationsOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe]
})
export class EmptyStateComponent {
  readonly icon = input<string>('notifications-off-outline');
  readonly titleKey = input<string>('common.emptyState.title');
  readonly messageKey = input<string>('common.emptyState.message');

  constructor() {
    addIcons({ notificationsOffOutline });
  }
}
