import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';

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
  imports: [SHARED_IMPORTS]
})
export class DashboardPage {
  constructor() {}
}