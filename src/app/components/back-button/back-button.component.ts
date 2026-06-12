import { Component, inject, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { NavigationService } from '@services/navigation.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class BackButtonComponent {
  private readonly navigationService = inject(NavigationService);

  readonly route = input<string | null>(null);

  constructor() {
    addIcons({ arrowBackOutline });
  }

  goBack(): void {
    const route = this.route();
    if (route) {
      this.navigationService.navigateTo([route]);
    } else {
      this.navigationService.goBack();
    }
  }
}
