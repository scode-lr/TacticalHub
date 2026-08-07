import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { NavigationService } from './navigation.service';

@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  private readonly apiService = inject(ApiService);
  private readonly navigationService = inject(NavigationService);
  private listenersReady = false;
  private currentToken: string | null = null;

  async register(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await this.addListeners();

    if (Capacitor.getPlatform() === 'android') {
      await PushNotifications.createChannel({
        id: 'tacticalhub_general',
        name: 'General',
        description: 'Noticias, formularios y avisos del club',
        importance: 4,
        visibility: 1,
        vibration: true
      });
    }

    let permission = await PushNotifications.checkPermissions();
    if (permission.receive === 'prompt' || permission.receive === 'prompt-with-rationale') {
      permission = await PushNotifications.requestPermissions();
    }
    if (permission.receive === 'granted') await PushNotifications.register();
  }

  async unregister(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    if (this.currentToken) {
      try {
        await firstValueFrom(this.apiService.delete('/push/devices', {
          body: { token: this.currentToken },
          skipErrorHandler: true
        }));
      } catch {
        // Native unregister still invalidates the token if the API is temporarily unavailable.
      }
    }
    await PushNotifications.unregister();
    this.currentToken = null;
  }

  private async addListeners(): Promise<void> {
    if (this.listenersReady) return;
    this.listenersReady = true;

    await PushNotifications.addListener('registration', token => {
      this.currentToken = token.value;
      void this.saveToken(token.value);
    });
    await PushNotifications.addListener('registrationError', error => {
      console.warn('Native push registration failed:', error.error);
    });
    await PushNotifications.addListener('pushNotificationActionPerformed', action => {
      this.openNotification(action.notification);
    });
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await firstValueFrom(this.apiService.post('/push/devices', {
        token,
        platform: Capacitor.getPlatform()
      }, { skipErrorHandler: true }));
    } catch {
      // Registration is retried on the next authenticated app start.
    }
  }

  private openNotification(notification: PushNotificationSchema): void {
    const roleType = Number(notification.data?.['roleType']);
    const userClubRoleId = Number(notification.data?.['userClubRoleId']);
    if (roleType > 0 && userClubRoleId > 0) {
      this.navigationService.navigateTo([`app/${roleType}/${userClubRoleId}/notifications`]);
    }
  }
}
