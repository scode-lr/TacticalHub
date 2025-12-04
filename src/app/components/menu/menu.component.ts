import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { 
  IonIcon,
  IonPopover
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
import { RoleType } from '@core/models/role.model';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
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
    IonPopover,
    TranslatePipe,
    RoleSelectorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuComponent {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);

  readonly config = input.required<MenuConfig>();
  
  readonly selectedMenuItem = signal<string>('');
  readonly isPopoverOpen = signal<boolean>(false);
  readonly user = signal<User | null>(null);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');

  readonly visibleMenuItems = computed(() => this.config().items.slice(0, 4));
  readonly hiddenMenuItems = computed(() => this.config().items.slice(4));

  constructor() {
    this.initializeIcons();
    this.loadUserData();
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
      ellipsisHorizontal,
      logOutOutline,
      settingsOutline
    });
  }

  private loadUserData() {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.user.set(storedUser);
      this.avatarUrl.set(storedUser.avatarUrl || 'assets/default-avatar.svg');
    }
  }

  private trackRouteChanges() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlParts = this.router.url.split('/');
        const currentRoute = urlParts[urlParts.length - 1];
        const menuItem = this.config().items.find(item => item.route === currentRoute);
        if (menuItem) {
          this.selectedMenuItem.set(menuItem.id);
        }
      });
  }

  selectMenuItem(item: MenuItem) {
    this.selectedMenuItem.set(item.id);
    this.isPopoverOpen.set(false);
    const role = this.config().role;
    this.router.navigate([`/app/${role}/${item.route}`]);
  }

  isSelected(itemId: string): boolean {
    return this.selectedMenuItem() === itemId;
  }

  togglePopover() {
    this.isPopoverOpen.set(!this.isPopoverOpen());
  }

  closePopover() {
    this.isPopoverOpen.set(false);
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
