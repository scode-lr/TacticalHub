import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { TranslationService } from './i18n/translation.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly alertCtrl = inject(AlertController);
  private readonly translation = inject(TranslationService);

  async request(): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header: this.translation.instant('common.confirmAlert.title'),
      message: this.translation.instant('common.confirmAlert.message'),
      buttons: [
        { text: this.translation.instant('common.confirmAlert.cancel'), role: 'cancel' },
        { text: this.translation.instant('common.confirmAlert.confirm'), role: 'confirm', cssClass: 'danger' }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}
