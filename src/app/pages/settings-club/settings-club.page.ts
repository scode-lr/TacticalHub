import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { addIcons } from 'ionicons';
import { settingsOutline, informationCircleOutline, documentTextOutline, walletOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings-club',
  templateUrl: './settings-club.page.html',
  styleUrls: ['./settings-club.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonIcon, TranslatePipe]
})
export class SettingsClubPage {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  readonly selectedTab = 'information';

  constructor() {
    addIcons({ settingsOutline, informationCircleOutline, documentTextOutline, walletOutline });
  }

  getSettingsInformationUrl(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/settings-club/information`;
  }

  getSettingsFormsUrl(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/settings-forms`;
  }

  getSettingsSponsorsUrl(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/settings-club/sponsors`;
  }
}
