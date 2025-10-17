import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-content">
      <div class="redirect-message">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Welcome to Dashboard!</p>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner]
})
export class DashboardPage {
  constructor() {}
}