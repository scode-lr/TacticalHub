import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed, inject, input, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {
  IonIcon
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
  settingsOutline
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
  description?: string;
  badge?: number;
}

export interface MenuConfig {
  role: RoleType;
  items: MenuItem[];
  moreItems?: MenuItem[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
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
  readonly currentMenuId = signal<string>('home');
  readonly user = signal<User | null>(null);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');

  readonly moreItems = computed(() => this.config().moreItems ?? []);
  readonly mobileMenuItems = computed(() =>
    this.config().items.filter(item => item.id !== 'home' && item.id !== 'notifications')
  );

  readonly inboxBadge = computed(() => this.inboxService.getUnreadCount());
  readonly notificationsBadge = computed(() => this.notificationsService.getUnreadCount());

  private withBadges(items: MenuItem[]) {
    return items.map(item => ({
      ...item,
      badge: item.id === 'inbox' ? this.inboxBadge() :
             item.id === 'notifications' ? this.notificationsBadge() :
             undefined
    }));
  }

  readonly menuItemsWithBadges = computed(() => this.withBadges(this.config().items));
  readonly moreItemsWithBadges = computed(() => this.withBadges(this.moreItems()));
  readonly mobileMenuItemsWithBadges = computed(() => this.withBadges(this.mobileMenuItems()));

  readonly isMoreActive = computed(() => {
    const menuId = this.currentMenuId();
    return menuId === 'more' || this.moreItems().some(item => item.route === menuId);
  });

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
      settingsOutline
    });
  }

  private loadUserData() {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.user.set(storedUser);
      this.avatarUrl.set(storedUser.metadata?.avatar || 'assets/default-avatar.svg');
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
      this.currentMenuId.set(menuId);
      const menuItem = [...this.config().items, ...this.moreItems()].find(item => item.route === menuId);
      this.selectedMenuItem.set(menuItem?.id ?? menuId);
    }
  }

  selectMenuItem(item: MenuItem) {
    this.selectedMenuItem.set(item.id);
    const role = this.currentRole();
    if (role) {
      this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/${item.route}`]);
    }
  }

  isSelected(itemId: string): boolean {
    return this.selectedMenuItem() === itemId;
  }

  goToMore() {
    const role = this.currentRole();
    if (role) {
      this.selectedMenuItem.set('more');
      this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/more`]);
    }
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
