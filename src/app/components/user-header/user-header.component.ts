import { Component, computed, inject, signal, HostListener, input, output } from '@angular/core';
import { IonAvatar, IonIcon, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { environment } from '@environment';
import { TranslatePipe } from '@pipes/translate.pipe';
import { User } from '@core/models/user.model';
import { Role, RoleType } from '@core/models/role.model';
import { UserService } from '@core/services/user.service';
import { NavigationService } from '@services/navigation.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TranslationService } from '@services/i18n/translation.service';
import { RoleSelectorComponent } from '@components/role-selector/role-selector.component';
import { DefaultImageDirective } from '@core/directives/default-image.directive';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  logOutOutline,
  menuOutline,
  notificationsOutline,
  personOutline,
  settingsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    IonIcon,
    IonImg,
    TranslatePipe,
    RoleSelectorComponent,
    DefaultImageDirective
  ]
})
export class UserHeaderComponent {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly translationService = inject(TranslationService);

  readonly showBackButton = input<boolean>(false);
  readonly showRoleSelector = input<boolean>(true);
  readonly currentRole = input<Role | null>(null);
  readonly backUrl = input<string | string[]>();
  readonly backClick = output<void>();

  user: User | null = null;
  readonly showAccountDrawer = signal<boolean>(false);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');
  readonly notificationsBadge = computed(() => this.notificationsService.getUnreadCount());
  readonly showNotificationsButton = computed(() => {
    const role = this.currentRole() ?? this.userService.getCurrentRole();
    return role?.roleId === RoleType.Member;
  });
  readonly defaultClubLogo = computed(() => (environment as Record<string, unknown>)['logoUrl'] as string ?? 'assets/image-non-available.svg');
  readonly displayName = computed(() => {
    const name = [this.user?.metadata?.firstName, this.user?.metadata?.lastName].filter(Boolean).join(' ').trim();
    return name || this.user?.username || '';
  });
  readonly currentRoleName = computed(() => {
    const role = this.currentRole() ?? this.userService.getCurrentRole();
    if (!role?.roleId) return '';
    return this.translationService.instant(`roles.${this.roleKey(role.roleId)}`);
  });

  constructor() {
    addIcons({
      arrowBackOutline,
      logOutOutline,
      menuOutline,
      notificationsOutline,
      personOutline,
      settingsOutline
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-drawer') && !target.closest('.hamburger-button')) {
      this.showAccountDrawer.set(false);
    }
  }

  loadUserData() {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.user = storedUser;
      this.avatarUrl.set(storedUser.metadata?.avatar || 'assets/default-avatar.svg');
    }
  }

  onAvatarError() {
    this.avatarUrl.set('assets/default-avatar.svg');
  }

  toggleAccountDrawer(event: MouseEvent) {
    event.stopPropagation();
    this.showAccountDrawer.set(!this.showAccountDrawer());
  }

  closeAccountDrawer() {
    this.showAccountDrawer.set(false);
  }

  onBackClick() {
    const url = this.backUrl();
    if (url) {
      this.navigationService.navigateTo(Array.isArray(url) ? url : [url]);
    } else {
      this.backClick.emit();
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

  goToProfile() {
    this.showAccountDrawer.set(false);
    this.navigationService.navigateTo(['/profile']);
  }

  goToSettings() {
    this.showAccountDrawer.set(false);
    this.navigationService.navigateTo(['/settings']);
  }

  async logout() {
    this.showAccountDrawer.set(false);
    await this.userService.logout();
  }

  private roleKey(roleType: RoleType): string {
    switch (roleType) {
      case RoleType.Admin: return 'admin';
      case RoleType.Coach: return 'coach';
      case RoleType.Member: return 'member';
      case RoleType.Guest: return 'guest';
      default: return 'member';
    }
  }
}
