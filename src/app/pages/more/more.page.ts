import { Component, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UserService } from '@core/services/user.service';
import { NavigationService } from '@services/navigation.service';
import { MobileNavigationService } from '@services/mobile-navigation.service';
import { RoleType } from '@core/models/role.model';
import { MenuItem } from '@components/menu/menu.component';
import { ActionRowComponent } from '@components/action-row/action-row.component';
import { AccountIdentityComponent } from '@components/account-identity/account-identity.component';
import { RoleSelectorComponent } from '@components/role-selector/role-selector.component';
import { MEMBER_MENU_CONFIG } from '../member/member.page';
import { ADMIN_MENU_CONFIG } from '../admin/admin.page';
import { GUEST_MENU_CONFIG } from '../guest/guest.page';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
  standalone: true,
  imports: [TranslatePipe, ActionRowComponent, AccountIdentityComponent, RoleSelectorComponent]
})
export class MorePage {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  readonly mobileNavigation = inject(MobileNavigationService);

  readonly currentRole = signal(this.userService.getCurrentRole());
  readonly user = computed(() => this.userService.getCurrentUser());
  readonly isGuest = computed(() => this.user()?.isGuest || this.currentRole()?.roleId === RoleType.Guest);
  readonly isSigningOut = signal(false);
  readonly items = computed(() => {
    const config = this.resolveConfig();
    // Guest More is a new route: keep its services visible when rotating to a
    // wider viewport even though account actions move back to the sidebar.
    const useMobileItems = this.mobileNavigation.accountInMore() || this.currentRole()?.roleId === RoleType.Guest;
    return (useMobileItems ? config?.mobileMoreItems ?? config?.moreItems : config?.moreItems) ?? [];
  });

  constructor() {
    // Ionic can cache this page while the active role changes.
    inject(Router).events.pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.currentRole.set(this.userService.getCurrentRole()));
  }

  private resolveConfig() {
    switch (this.currentRole()?.roleId) {
      case RoleType.Admin: return ADMIN_MENU_CONFIG;
      case RoleType.Member: return MEMBER_MENU_CONFIG;
      case RoleType.Guest: return GUEST_MENU_CONFIG;
      default: return null;
    }
  }

  goTo(item: MenuItem): void {
    const role = this.currentRole();
    if (role && this.items().some(available => available.id === item.id)) {
      const id = role.roleId === RoleType.Guest ? role.clubId : role.id;
      this.navigationService.navigateTo([`/app/${role.roleId}/${id}/${item.route}`]);
    }
  }

  openAccount(page: 'profile' | 'settings'): void {
    if (this.mobileNavigation.accountInMore() && !this.isGuest()) this.mobileNavigation.openAccount(page);
  }

  async logout(): Promise<void> {
    if (this.isSigningOut()) return;
    this.isSigningOut.set(true);
    try { await this.userService.logout(); }
    finally { this.isSigningOut.set(false); }
  }
}
