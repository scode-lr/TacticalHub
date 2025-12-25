import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { constructOutline } from 'ionicons/icons';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.page.html',
  styleUrls: ['./placeholder.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    TranslatePipe
  ]
})
export class PlaceholderPage {
  @Input() title: string = 'common.comingSoon';
  @Input() description: string = 'common.pageUnderConstruction';
  @Input() icon: string = 'construct-outline';

  constructor() {
    addIcons({ constructOutline });
  }
}
