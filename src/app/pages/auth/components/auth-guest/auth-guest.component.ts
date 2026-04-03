import { Component, inject } from '@angular/core';
import { IonText, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { addIcons } from 'ionicons';
import { eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-auth-guest',
  standalone: true,
  imports: [IonText, IonIcon, TranslatePipe],
  templateUrl: './auth-guest.component.html',
  styleUrls: ['./auth-guest.component.scss']
})
export class AuthGuestComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);

  constructor() {
    addIcons({ eyeOutline });
  }

  async continueAsGuest(): Promise<void> {
    await this.authService.signInAsGuest();
    this.navigationService.navigateTo(['/auth/loading'], { queryParams: { guest: 'true' } });
  }
}
