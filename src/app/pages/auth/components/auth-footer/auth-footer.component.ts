import { Component, inject, input } from '@angular/core';
import { IonText, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { AuthService } from '@services/auth.service';
import { SocialLoginComponent, SocialLoginResult } from '../social-login/social-login.component';
import { addIcons } from 'ionicons';
import { eyeOutline } from 'ionicons/icons';
import { environment } from '@environment';

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
  private readonly authService = inject(AuthService);

  constructor() {
    addIcons({ eyeOutline });
  }

  onNavigateToSignIn(): void {
    this.navigationService.navigateTo(['/auth/signin']);
  }

  onNavigateToSignUp(): void {
    this.navigationService.navigateTo(['/auth/signup']);
  }

  async onContinueAsGuest(): Promise<void> {
    const response = await this.authService.signInAsGuest();
    
    if (response.success) {
      if (environment.private) {
        // to loading page -> create virtual link to teams selection -> redirect home
        this.navigationService.navigateTo(['/teams/selection']);
      } else {
        console.log('Navigating to join team as guest...');
        this.navigationService.navigateTo(['/teams/join'], { queryParams: { guest: 'true' } });
      }
    }
  }

  onSocialLoginComplete(result: SocialLoginResult): void {
    if (result.success) {
      setTimeout(() => {
        this.navigationService.navigateTo(['/app/teams-search']);
      }, 800);
    }
  }
}
