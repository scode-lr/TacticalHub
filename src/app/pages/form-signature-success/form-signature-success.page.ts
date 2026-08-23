import { Component, inject } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { RolesService } from '@services/roles.service';

/**
 * Full-screen, chrome-less confirmation shown right after a signature is submitted.
 *
 * Deliberately outside the role shell (no header, no bottom nav) and reached with
 * `replaceUrl: true`, so there is no back button and no stale filled-in form to return to —
 * the only way forward is the button, which is the whole point of this screen.
 */
@Component({
  selector: 'app-form-signature-success',
  templateUrl: './form-signature-success.page.html',
  styleUrls: ['./form-signature-success.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, TranslatePipe],
})
export class FormSignatureSuccessPage {
  private readonly navigationService = inject(NavigationService);
  private readonly rolesService = inject(RolesService);

  constructor() {
    addIcons({ checkmarkCircleOutline });
  }

  goToForms(): void {
    const role = this.rolesService.getCurrentRole();
    if (!role) {
      this.navigationService.navigateTo(['/teams/selection']);
      return;
    }

    this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/forms`], { replaceUrl: true });
  }
}
