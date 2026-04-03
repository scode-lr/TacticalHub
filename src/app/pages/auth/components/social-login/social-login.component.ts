import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';

export type SocialProvider = 'google' | 'apple';

export interface SocialLoginResult {
  provider: SocialProvider;
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonSpinner,
    TranslatePipe
  ]
})
export class SocialLoginComponent {
  @Input() mode: 'signin' | 'signup' = 'signin';
  @Output() loginComplete = new EventEmitter<SocialLoginResult>();

  isLoading = false;
  currentProvider: SocialProvider | null = null;

  constructor() {
    addIcons({ logoGoogle, logoApple });
  }

  async onGoogleClick() {
    await this.handleSocialLogin('google');
  }

  async onAppleClick() {
    await this.handleSocialLogin('apple');
  }

  private async handleSocialLogin(provider: SocialProvider) {
    this.isLoading = true;
    this.currentProvider = provider;

    try {
      // Simulate API call - replace with actual implementation
      await this.simulateSocialAuth(provider);
      
      this.loginComplete.emit({
        provider,
        success: true
      });
    } catch (error) {
      this.loginComplete.emit({
        provider,
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
    } finally {
      this.isLoading = false;
      this.currentProvider = null;
    }
  }

  private async simulateSocialAuth(provider: SocialProvider): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error(`${provider} authentication failed`));
        }
      }, 1500);
    });
  }

  isProviderLoading(provider: SocialProvider): boolean {
    return this.isLoading && this.currentProvider === provider;
  }
}
