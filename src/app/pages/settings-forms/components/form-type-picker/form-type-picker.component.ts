import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormAction } from '@core/models/form-action.enum';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bodyOutline, chevronForwardOutline, closeOutline, documentTextOutline, peopleOutline } from 'ionicons/icons';

interface TypeOption {
  action: FormAction;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

@Component({
  selector: 'app-form-type-picker',
  templateUrl: './form-type-picker.component.html',
  styleUrls: ['./form-type-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, TranslatePipe]
})
export class FormTypePickerComponent {
  readonly isOpen = input.required<boolean>();

  readonly typeSelected = output<FormAction>();
  readonly didDismiss = output<void>();

  private pendingAction: FormAction | null = null;

  readonly options: TypeOption[] = [
    { action: FormAction.RegisterPlayer, icon: 'body-outline', titleKey: 'admin.settingsForms.typePicker.registerPlayerTitle', descriptionKey: 'admin.settingsForms.typePicker.registerPlayerDescription' },
    { action: FormAction.BecomeMember, icon: 'people-outline', titleKey: 'admin.settingsForms.typePicker.becomeMemberTitle', descriptionKey: 'admin.settingsForms.typePicker.becomeMemberDescription' },
    { action: FormAction.Simple, icon: 'document-text-outline', titleKey: 'admin.settingsForms.typePicker.generalTitle', descriptionKey: 'admin.settingsForms.typePicker.generalDescription' }
  ];

  constructor() {
    addIcons({ bodyOutline, chevronForwardOutline, closeOutline, documentTextOutline, peopleOutline });
  }

  close(): void {
    this.pendingAction = null;
    this.didDismiss.emit();
  }

  choose(action: FormAction): void {
    // Only request the close here; the actual selection is emitted from
    // onNativeDismiss() once ion-modal has genuinely finished closing.
    // Emitting typeSelected (and letting the caller navigate) right away
    // would race the modal's own close animation and cut it short.
    this.pendingAction = action;
    this.didDismiss.emit();
  }

  /** Bound to ion-modal's own native didDismiss event, fired once it has actually closed. */
  onNativeDismiss(): void {
    const action = this.pendingAction;
    this.pendingAction = null;
    if (action) {
      this.typeSelected.emit(action);
    }
  }
}
