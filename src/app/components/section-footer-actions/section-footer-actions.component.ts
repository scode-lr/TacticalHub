import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { eyeOutline, saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-section-footer-actions',
  templateUrl: './section-footer-actions.component.html',
  styleUrls: ['./section-footer-actions.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe]
})
export class SectionFooterActionsComponent {
  readonly canCancel = input.required<boolean>();
  readonly canPreview = input.required<boolean>();
  readonly canSave = input.required<boolean>();

  readonly cancelLabel = input<string>('common.cancel');
  readonly previewLabel = input.required<string>();
  readonly saveLabel = input<string>('common.save');

  readonly cancelAction = output<void>();
  readonly previewAction = output<void>();
  readonly saveAction = output<void>();

  constructor() {
    addIcons({ eyeOutline, saveOutline });
  }
}
