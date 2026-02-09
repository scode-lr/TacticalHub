import { Component, inject, input } from '@angular/core';
import { IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { SocialLoginComponent, SocialLoginResult } from '../social-login/social-login.component';
import { AuthGuestComponent } from '../auth-guest/auth-guest.component';

@Component({
  selector: 'app-auth-footer',
  standalone: true,
  imports: [IonText, TranslatePipe, SocialLoginComponent, AuthGuestComponent],
  templateUrl: './auth-footer.component.html',
  styleUrls: ['./auth-footer.component.scss']
})
export class AuthFooterComponent {
  readonly mode = input.required<'signin' | 'signup'>();
  
  private readonly navigationService = inject(NavigationService);

  onNavigateToSignIn(): void {
    this.navigationService.navigateTo(['/auth/signin']);
  }

  onNavigateToSignUp(): void {
    this.navigationService.navigateTo(['/auth/signup']);
  }

  onSocialLoginComplete(result: SocialLoginResult): void {
    if (result.success) {
      setTimeout(() => {
        this.navigationService.navigateTo(['/app/teams-search']);
      }, 800);
    }
  }
}