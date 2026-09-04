import { Component, computed, inject, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { environment } from '@environment';
import { TranslatePipe } from '@pipes/translate.pipe';
import { Role, RoleType } from '@core/models/role.model';
import { UserService } from '@core/services/user.service';
import { NavigationService } from '@services/navigation.service';
import { NotificationsService } from '@core/services/notifications.service';
import { DefaultImageDirective } from '@core/directives/default-image.directive';
import { addIcons } from 'ionicons';
import { arrowBackOutline, notificationsOutline } from 'ionicons/icons';

/**
 * Two uses: the home page (club logo + notifications for Members) and, on mobile only,
 * a page's own back-button bar (title + back arrow) — each page supplies its own title
 * and back target directly, there is no shell/URL-matching logic behind it.
 */
@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, DefaultImageDirective]
})
export class UserHeaderComponent {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private readonly notificationsService = inject(NotificationsService);

  readonly currentRole = input<Role | null>(null);
  readonly showBackButton = input<boolean>(false);
  /** Translation key (or literal text) for the back-button bar's title. */
  readonly title = input<string | null>(null);
  /** Route to navigate back to; falls back to browser history when omitted. */
  readonly backRoute = input<string | null>(null);

  readonly notificationsBadge = computed(() => this.notificationsService.getUnreadCount());
  readonly showNotificationsButton = computed(() => {
    if (this.showBackButton()) return false;
    const role = this.currentRole() ?? this.userService.getCurrentRole();
    return role?.roleId === RoleType.Member;
  });
  readonly defaultClubLogo = computed(() => (environment as Record<string, unknown>)['logoUrl'] as string ?? 'assets/image-non-available.svg');

  constructor() {
    addIcons({ arrowBackOutline, notificationsOutline });
  }

  goBack(): void {
    const route = this.backRoute();
    if (route) {
      this.navigationService.navigateTo([route]);
    } else {
      this.navigationService.goBack();
    }
  }

  goToNotifications() {
    const role = this.currentRole() ?? this.userService.getCurrentRole();
    if (!role || role.roleId === RoleType.Guest) return;
    this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/notifications`]);
  }

  goToHome() {
    const role = this.currentRole() ?? this.userService.getCurrentRole();
    if (!role) return;
    this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/home`]);
  }
}
