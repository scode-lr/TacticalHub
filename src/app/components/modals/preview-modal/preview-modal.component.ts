import { Component, input, output } from '@angular/core';
import { IonModal, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { closeOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.scss'],
  standalone: true,
  imports: [IonModal, IonIcon, TranslatePipe]
})
export class PreviewModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly notice = input<string>('');
  readonly emptyMessage = input<string>('');
  readonly isEmpty = input(false);
  readonly didDismiss = output<void>();

  constructor() {
    addIcons({ closeOutline, eyeOutline });
  }

  close(): void {
    this.didDismiss.emit();
  }
}
