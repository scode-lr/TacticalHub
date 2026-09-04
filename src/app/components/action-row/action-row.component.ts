import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, folderOutline, informationCircleOutline, mailOutline, personOutline, settingsOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-action-row',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './action-row.component.html',
  styleUrls: ['./action-row.component.scss'],
})
export class ActionRowComponent {
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly description = input<string>('');
  readonly compact = input(false);
  readonly danger = input(false);
  readonly disabled = input(false);
  readonly showChevron = input(true);
  readonly activated = output<void>();

  constructor() {
    addIcons({ chevronForwardOutline, folderOutline, informationCircleOutline, mailOutline, personOutline, settingsOutline, logOutOutline });
  }
}
