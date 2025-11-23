import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed, inject } from '@angular/core';
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
  personOutline
} from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { filter } from 'rxjs/operators';
import { RoleSelectorComponent } from '@components/role-selector/role-selector.component';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-viewer-menu',
  templateUrl: './viewer-menu.component.html',
  styleUrls: ['./viewer-menu.component.scss'],
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
export class ViewerMenuComponent {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  
  readonly selectedMenuItem = signal<string>('home');
  readonly isPopoverOpen = signal<boolean>(false);
  readonly user = signal<User | null>(null);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');
  
  readonly menuItems: MenuItem[] = [
    { id: 'home', label: 'viewer.menu.home', icon: 'home-outline', route: 'home' },
    { id: 'news', label: 'viewer.menu.news', icon: 'newspaper-outline', route: 'news' },
    { id: 'action', label: 'viewer.menu.action', icon: 'add-circle-outline', route: 'action' },
    { id: 'information', label: 'viewer.menu.information', icon: 'information-circle-outline', route: 'information' },
    { id: 'proposals', label: 'viewer.menu.proposals', icon: 'chatbubble-ellipses-outline', route: 'proposals' },
    { id: 'matches', label: 'viewer.menu.matches', icon: 'football-outline', route: 'matches' },
    { id: 'partners', label: 'viewer.menu.partners', icon: 'people-outline', route: 'partners' }
  ];

  readonly visibleMenuItems = computed(() => this.menuItems.slice(0, 4));
  readonly hiddenMenuItems = computed(() => this.menuItems.slice(4));

  constructor() {
    this.initializeIcons();
    this.trackRouteChanges();
    this.loadUserData();
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
      personOutline
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
        const currentRoute = this.router.url.split('/').pop();
        const menuItem = this.menuItems.find(item => item.route === currentRoute);
        if (menuItem) {
          this.selectedMenuItem.set(menuItem.id);
        }
      });
  }

  selectMenuItem(item: MenuItem) {
    this.selectedMenuItem.set(item.id);
    this.isPopoverOpen.set(false);
    
    const roleId = this.router.url.split('/')[2];
    this.router.navigate([`/app/${roleId}/${item.route}`]);
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

  logout() {
    this.userService.logout();
  }

  onAvatarError() {
    this.avatarUrl.set('assets/default-avatar.svg');
  }
}
