import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { TranslationService } from './i18n/translation.service';

interface ConfirmOptions {
  header?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly alertCtrl = inject(AlertController);
  private readonly translation = inject(TranslationService);

  async request(options: ConfirmOptions = {}): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header: options.header ?? this.translation.instant('common.confirmAlert.title'),
      message: options.message ?? this.translation.instant('common.confirmAlert.message'),
      buttons: [
        { text: options.cancelText ?? this.translation.instant('common.confirmAlert.cancel'), role: 'cancel' },
        {
          text: options.confirmText ?? this.translation.instant('common.confirmAlert.confirm'),
          role: 'confirm',
          cssClass: options.danger === false ? undefined : 'danger'
        }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}
