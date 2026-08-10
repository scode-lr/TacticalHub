import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UserService } from '@core/services/user.service';
import { NavigationService } from '@services/navigation.service';
import { RoleType } from '@core/models/role.model';
import { MenuItem } from '@components/menu/menu.component';
import { MEMBER_MENU_CONFIG } from '../member/member.page';
import { ADMIN_MENU_CONFIG } from '../admin/admin.page';
import { GUEST_MENU_CONFIG } from '../guest/guest.page';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class MorePage {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);

  readonly currentRole = this.userService.getCurrentRole();
  readonly items = this.resolveItems();

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  private resolveItems(): MenuItem[] {
    switch (this.currentRole?.roleId) {
      case RoleType.Admin:
        return ADMIN_MENU_CONFIG.moreItems ?? [];
      case RoleType.Guest:
        return GUEST_MENU_CONFIG.moreItems ?? [];
      default:
        return MEMBER_MENU_CONFIG.moreItems ?? [];
    }
  }

  goTo(item: MenuItem): void {
    const role = this.currentRole;
    if (role) {
      this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/${item.route}`]);
    }
  }
}
