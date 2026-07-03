import { Component, computed, inject, signal, HostListener, input, output } from '@angular/core';
import { IonAvatar, IonIcon, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@pipes/translate.pipe';
import { User } from '@core/models/user.model';
import { Role, RoleType } from '@core/models/role.model';
import { UserService } from '@core/services/user.service';
import { NavigationService } from '@services/navigation.service';
import { NotificationsService } from '@core/services/notifications.service';
import { RoleSelectorComponent } from '@components/role-selector/role-selector.component';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  logOutOutline,
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
    RoleSelectorComponent
  ]
})
export class UserHeaderComponent {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private readonly notificationsService = inject(NotificationsService);
  
  readonly showBackButton = input<boolean>(false);
  readonly showRoleSelector = input<boolean>(true);
  readonly currentRole = input<Role | null>(null);
  readonly backUrl = input<string | string[]>();
  readonly backClick = output<void>();
  
  user: User | null = null;
  readonly showUserMenu = signal<boolean>(false);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');
  readonly notificationsBadge = computed(() => this.notificationsService.getUnreadCount());
  readonly showNotificationsButton = computed(() => {
    const role = this.currentRole() ?? this.userService.getCurrentRole();
    return role?.roleId === RoleType.Admin || role?.roleId === RoleType.Member;
  });

  constructor() {
    addIcons({
      arrowBackOutline,
      logOutOutline,
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
    if (!target.closest('.user-menu') && !target.closest('.user-dropdown')) {
      this.showUserMenu.set(false);
    }
  }

  loadUserData() {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.user = storedUser;
      this.avatarUrl.set(storedUser.avatarUrl || 'assets/default-avatar.svg');
    }
  }

  onAvatarError() {
    this.avatarUrl.set('assets/default-avatar.svg');
  }

  toggleUserMenu() {
    this.showUserMenu.set(!this.showUserMenu());
  }

  onUserClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleUserMenu();
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
    this.showUserMenu.set(false);
    this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/notifications`]);
  }

  goToProfile() {
    this.showUserMenu.set(false);
    this.navigationService.navigateTo(['/profile']);
  }

  goToSettings() {
    this.showUserMenu.set(false);
    this.navigationService.navigateTo(['/settings']);
  }

  async logout() {
    this.showUserMenu.set(false);
    await this.userService.logout();
  }
}
