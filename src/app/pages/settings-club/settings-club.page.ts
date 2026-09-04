import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { ActionRowComponent } from '@components/action-row/action-row.component';
import { addIcons } from 'ionicons';
import { settingsOutline, informationCircleOutline, documentTextOutline, walletOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings-club',
  templateUrl: './settings-club.page.html',
  styleUrls: ['./settings-club.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe, BackButtonComponent, UserHeaderComponent, ActionRowComponent]
})
export class SettingsClubPage {
  private readonly navigationService = inject(NavigationService);

  readonly selectedTab = 'information';

  constructor() {
    addIcons({ settingsOutline, informationCircleOutline, documentTextOutline, walletOutline });
  }

  backRoute(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/more`;
  }

  goToInformation(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-club/information`]);
  }

  goToForms(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-forms`]);
  }

  goToSponsors(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-club/sponsors`]);
  }
}
