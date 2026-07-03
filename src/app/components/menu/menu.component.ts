import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed, inject, input, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { 
  IonIcon,
  IonModal
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline,
  newspaperOutline,
  addCircleOutline,
  informationCircleOutline,
  chatbubbleEllipsesOutline,
  footballOutline,
  peopleOutline,
  mailOutline,
  ellipsisHorizontal,
  logOutOutline,
  settingsOutline,
  closeOutline
} from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { filter } from 'rxjs/operators';
import { RoleSelectorComponent } from '@components/role-selector/role-selector.component';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';
import { NavigationService } from '@services/navigation.service';
import { Role, RoleType } from '@core/models/role.model';
import { InboxService } from '@core/services/inbox.service';
import { NotificationsService } from '@core/services/notifications.service';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

export interface MenuConfig {
  role: RoleType;
  items: MenuItem[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonModal,
    TranslatePipe,
    RoleSelectorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private readonly inboxService = inject(InboxService);
  private readonly notificationsService = inject(NotificationsService);

  readonly config = input.required<MenuConfig>();
  readonly currentRole = input<Role | null>();
  
  readonly selectedMenuItem = signal<string>('home');
  readonly isModalOpen = signal<boolean>(false);
  readonly user = signal<User | null>(null);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');

  readonly visibleMenuItems = computed(() => this.config().items.slice(0, 4));
  readonly hiddenMenuItems = computed(() => this.config().items.slice(4));

  readonly inboxBadge = computed(() => this.inboxService.getUnreadCount());
  readonly notificationsBadge = computed(() => this.notificationsService.getUnreadCount());

  readonly menuItemsWithBadges = computed(() => {
    return this.config().items.map(item => ({
      ...item,
      badge: item.id === 'inbox' ? this.inboxBadge() : 
             item.id === 'notifications' ? this.notificationsBadge() : 
             undefined
    }));
  });

  readonly visibleMenuItemsWithBadges = computed(() => this.menuItemsWithBadges().slice(0, 4));
  readonly hiddenMenuItemsWithBadges = computed(() => this.menuItemsWithBadges().slice(4));

  constructor() {
    this.initializeIcons();
    this.loadUserData();
    this.subscribeToRouterEvents();
  }

  ngOnInit(): void {
    this.trackRouteChanges();
  }

  private initializeIcons() {
    addIcons({ 
      homeOutline,
      newspaperOutline,
      addCircleOutline,
      informationCircleOutline,
      chatbubbleEllipsesOutline,
      footballOutline,
      peopleOutline,
      mailOutline,
      ellipsisHorizontal,
      logOutOutline,
      settingsOutline,
      closeOutline
    });
  }

  private loadUserData() {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.user.set(storedUser);
      this.avatarUrl.set(storedUser.avatarUrl || 'assets/default-avatar.svg');
    }
  }

  private subscribeToRouterEvents() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.trackRouteChanges();
      });
  }

  private trackRouteChanges() {
    const menuId = this.navigationService.getMenuIdFromUrl();
    if (menuId) {
      const menuItem = this.config().items.find(item => item.route === menuId);
      if (menuItem) {
        this.selectedMenuItem.set(menuItem.id);
      }
    }
  }

  selectMenuItem(item: MenuItem) {
    this.selectedMenuItem.set(item.id);
    this.isModalOpen.set(false);
    const role = this.currentRole();
    if (role) {
      console.log(`/app/${role.roleId}/${role.id}/${item.route}`);
      this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/${item.route}`]);
    }
  }

  isSelected(itemId: string): boolean {
    return this.selectedMenuItem() === itemId;
  }

  toggleModal() {
    this.isModalOpen.set(!this.isModalOpen());
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  goToSettings() {
    this.navigationService.navigateTo(['/settings']);
  }

  logout() {
    this.userService.logout();
  }

  onAvatarError() {
    this.avatarUrl.set('assets/default-avatar.svg');
  }
}
