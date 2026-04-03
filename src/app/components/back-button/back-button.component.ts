import { Component, inject } from '@angular/core';
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

  constructor() {
    addIcons({ arrowBackOutline });
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
