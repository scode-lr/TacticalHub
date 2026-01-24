import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.page.html',
  styleUrls: ['./membership.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    TranslatePipe
  ]
})
export class MembershipPage {
}
