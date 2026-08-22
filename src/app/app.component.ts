import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { UserService } from '@services/user.service';
import { environment } from '@environment';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly titleService = inject(Title);

  async ngOnInit() {
    await this.applyStatusBarStyle();
    this.titleService.setTitle(environment.name);
    await this.refreshUserData();
  }

  private async applyStatusBarStyle(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Force light (white) status bar text so the clock stays readable regardless
      // of the device's default style, which is what caused it to be invisible
      // against the black status bar background on some devices.
      await StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#000000' });
      }
    } catch {
      // Status bar APIs can be unavailable on some platforms/devices — non-critical.
    }
  }

  private async refreshUserData(): Promise<void> {
    const storedUser = this.userService.getStoredUser();

    if (!storedUser || storedUser.isGuest || !this.userService.isAuthenticated()) {
      return;
    }

    await this.userService.fetchUserProfile();    
  }
}
