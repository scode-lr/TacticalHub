import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  ActivatedRoute,
  Router,
  NavigationEnd,
} from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent, MenuConfig } from '@components/menu/menu.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { RoleType, Role } from '@core/models/role.model';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationService } from '@services/navigation.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    MenuComponent,
    UserHeaderComponent,
  ],
})
export class AdminPage implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);

  readonly memberId = signal<string>('');
  readonly currentRole = signal<Role | null>(null);

  readonly adminMenuConfig: MenuConfig = {
    role: RoleType.Admin,
    items: [
      {
        id: 'home',
        label: 'admin.menu.home',
        icon: 'home-outline',
        route: 'home',
      },
      // { id: 'inbox', label: 'admin.menu.inbox', icon: 'mail-outline', route: 'inbox' },
      {
        id: 'notifications',
        label: 'admin.menu.notifications',
        icon: 'notifications-outline',
        route: 'notifications',
      },
      {
        id: 'forms-submissions',
        label: 'admin.menu.forms',
        icon: 'document-text-outline',
        route: 'forms-submissions',
      },
      { id: 'news', label: 'admin.menu.news', icon: 'newspaper-outline', route: 'news' },
      {
        id: 'settings-club',
        label: 'admin.menu.settings',
        icon: 'settings-outline',
        route: 'settings-club',
      },
      // { id: 'params', label: 'admin.menu.params', icon: 'settings-outline', route: 'params' },
      // { id: 'teams', label: 'admin.menu.teams', icon: 'people-circle-outline', route: 'teams' },
      // { id: 'matches', label: 'admin.menu.matches', icon: 'football-outline', route: 'matches' },
      // { id: 'membership', label: 'admin.menu.membership', icon: 'card-outline', route: 'membership' },
      // { id: 'club', label: 'admin.menu.club', icon: 'business-outline', route: 'club' },
      // { id: 'users', label: 'admin.menu.users', icon: 'person-outline', route: 'users' },
    ],
  };

  readonly isDetailPage = signal<boolean>(false);
  readonly backUrl = computed(() => {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const url = this.router.url;
    if (this.isDetailPage()) {
      if (url.includes('/news')) {
        return `app/${roleType}/${roleId}/news`;
      }
      if (url.includes('/teams')) {
        return `app/${roleType}/${roleId}/teams`;
      }
      if (url.includes('/matches')) {
        return `app/${roleType}/${roleId}/matches`;
      }
      if (url.includes('/settings-club/information')) {
        return `app/${roleType}/${roleId}/settings-club`;
      }
      if (url.includes('/settings-club/sponsors')) {
        return `app/${roleType}/${roleId}/settings-club`;
      }
      if (url.includes('/settings-forms/:formId')) {
        console.log('url', url);
        return `app/${roleType}/${roleId}/settings-forms`;
      }
      if (url.includes('/forms-submissions')) {
        return `app/${roleType}/${roleId}/forms-submissions`;
      }
      if (url.includes('/forms')) {
        return `app/${roleType}/${roleId}/forms`;
      }
    }
    return `app/${roleType}/${roleId}/home`;
  });

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
    const url = this.router.url;
    const isDetail =
      (url.includes('/news/') && url.split('/').length > 5) ||
      (url.includes('/matches/') && url.split('/').length > 5) ||
      (url.includes('/teams/') && url.split('/').length > 5) ||
      (url.includes('/forms/') && url.split('/').length > 5) ||
      url.includes('/settings-club/information') ||
      url.includes('/settings-forms') ||
      (url.includes('/forms-submissions/') && url.split('/').length > 5) ||
      url.includes('/settings-club/sponsors');
    this.isDetailPage.set(isDetail);
  }

  private loadCurrentRole(): void {
    const role = this.userService.getCurrentRole();
    this.currentRole.set(role);
  }

  goBack() {
    this.navigationService.navigateTo([this.backUrl()]);
  }
}
