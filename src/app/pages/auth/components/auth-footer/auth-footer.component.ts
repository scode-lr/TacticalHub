import { Component, inject, input } from '@angular/core';
import { IonText, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { SocialLoginComponent, SocialLoginResult } from '../social-login/social-login.component';
import { addIcons } from 'ionicons';
import { eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-auth-footer',
  standalone: true,
  imports: [IonText, IonIcon, TranslatePipe, SocialLoginComponent],
  templateUrl: './auth-footer.component.html',
  styleUrls: ['./auth-footer.component.scss']
})
export class AuthFooterComponent {
  readonly mode = input.required<'signin' | 'signup'>();
  
  private readonly navigationService = inject(NavigationService);

  constructor() {
    addIcons({ eyeOutline });
  }

  onNavigateToSignIn(): void {
    this.navigationService.navigateTo(['/auth/signin']);
  }

  onNavigateToSignUp(): void {
    this.navigationService.navigateTo(['/auth/signup']);
  }

  onContinueAsGuest(): void {
    this.navigationService.navigateTo(['/app/teams-search']);
  }

  onSocialLoginComplete(result: SocialLoginResult): void {
    if (result.success) {
      setTimeout(() => {
        this.navigationService.navigateTo(['/app/teams-search']);
      }, 800);
    }
  }
}
