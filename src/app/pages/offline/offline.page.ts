import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudOfflineOutline, refreshOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthService } from '@services/auth.service';
import { NetworkService } from '@services/network.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe]
})
export class OfflinePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly networkService = inject(NetworkService);
  private readonly userService = inject(UserService);

  readonly checking = signal(false);
  readonly retryFailed = signal(false);

  constructor() {
    addIcons({ cloudOfflineOutline, refreshOutline });
  }

  @HostListener('window:online')
  onConnectionRestored(): void {
    void this.retry();
  }

  async retry(): Promise<void> {
    if (this.checking()) return;

    this.retryFailed.set(false);
    if (!this.networkService.isOnline()) {
      this.retryFailed.set(true);
      return;
    }

    this.checking.set(true);
    const returnUrl = this.getReturnUrl();

    try {
      if (this.userService.getStoredUser()) {
        const restored = await this.authService.initializeAuth();
        if (!restored) {
          // A transient API failure keeps the stored user intact, so remain on
          // this page. A confirmed 401/403 clears it and may proceed to sign-in.
          if (this.userService.getStoredUser()) {
            this.retryFailed.set(true);
            return;
          }

          await this.router.navigate(['/auth/signin'], {
            queryParams: { returnUrl }
          });
          return;
        }
      }

      await this.router.navigateByUrl(returnUrl);
    } finally {
      this.checking.set(false);
    }
  }

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl?.startsWith('/') && !returnUrl.startsWith('//') && returnUrl !== '/offline'
      ? returnUrl
      : '/auth/welcome';
  }
}
