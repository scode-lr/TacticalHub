import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { MenuComponent, MenuConfig } from '@components/menu/menu.component';
import { RoleType, Role } from '@core/models/role.model';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@core/services/user.service';

export const ADMIN_MENU_CONFIG: MenuConfig = {
  role: RoleType.Admin,
  items: [
    {
      id: 'home',
      label: 'admin.menu.home',
      icon: 'home-outline',
      route: 'home',
    },
    { id: 'inbox', label: 'admin.menu.inbox', icon: 'mail-outline', route: 'inbox' },
    {
      id: 'forms-submissions',
      label: 'admin.menu.forms',
      icon: 'document-text-outline',
      route: 'forms-submissions',
    },
    { id: 'news', label: 'admin.menu.news', icon: 'newspaper-outline', route: 'news' },
    // { id: 'teams', label: 'admin.menu.teams', icon: 'people-circle-outline', route: 'teams' },
    // { id: 'matches', label: 'admin.menu.matches', icon: 'football-outline', route: 'matches' },
    // { id: 'membership', label: 'admin.menu.membership', icon: 'card-outline', route: 'membership' },
    // { id: 'club', label: 'admin.menu.club', icon: 'business-outline', route: 'club' },
  ],
  moreItems: [
    {
      id: 'settings-club',
      label: 'admin.menu.settings',
      icon: 'settings-outline',
      route: 'settings-club',
      description: 'admin.description.settings',
    },
    {
      id: 'users',
      label: 'admin.menu.users',
      icon: 'person-outline',
      route: 'users',
      description: 'admin.description.users',
    }
  ],
};

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonRouterOutlet,
    MenuComponent,
  ],
})
export class AdminPage implements OnInit {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly memberId = signal<string>('');
  readonly currentRole = signal<Role | null>(null);

  readonly adminMenuConfig = ADMIN_MENU_CONFIG;

  readonly isDetailPage = signal<boolean>(false);

  constructor() {
    this.loadCurrentRole();
    this.subscribeToRouterEvents();
  }

  ngOnInit(): void {
    this.checkIfDetailPage();
  }

  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.checkIfDetailPage();
      });
  }

  private checkIfDetailPage(): void {
    this.loadCurrentRole();
    const url = this.router.url;
    const isDetail =
      (url.includes('/news/') && url.split('/').length > 5) ||
      (url.includes('/matches/') && url.split('/').length > 5) ||
      (url.includes('/teams/') && url.split('/').length > 5) ||
      (url.includes('/forms/') && url.split('/').length > 5) ||
      url.includes('/settings-club/information') ||
      url.includes('/settings-forms') ||
      (url.includes('/forms-submissions/') && url.split('/').length > 5) ||
      url.includes('/settings-club/sponsors') ||
      url.includes('/contact') ||
      url.includes('/notifications');
    this.isDetailPage.set(isDetail);
  }

  private loadCurrentRole(): void {
    const role = this.userService.getCurrentRole();
    this.currentRole.set(role);
  }
}
