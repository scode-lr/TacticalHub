import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent, MenuConfig } from '@components/menu/menu.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { RoleType, Role } from '@core/models/role.model';
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
    UserHeaderComponent
  ],
})
export class AdminPage {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  
  readonly memberId = signal<string>('');
  readonly currentRole = signal<Role | null>(null);
  
  readonly adminMenuConfig: MenuConfig = {
    role: RoleType.Admin,
    items: [
      { id: 'home', label: 'admin.menu.home', icon: 'home-outline', route: 'home' },
      { id: 'news', label: 'admin.menu.news', icon: 'newspaper-outline', route: 'news' },
      { id: 'params', label: 'admin.menu.params', icon: 'settings-outline', route: 'params' },
      { id: 'teams', label: 'admin.menu.teams', icon: 'people-circle-outline', route: 'teams' },
      { id: 'club', label: 'admin.menu.club', icon: 'business-outline', route: 'club' },
      { id: 'matches', label: 'admin.menu.matches', icon: 'football-outline', route: 'matches' },
      { id: 'users', label: 'admin.menu.users', icon: 'person-outline', route: 'users' }
    ]
  };
  
  readonly isDetailPage = signal<boolean>(false);
  readonly backUrl = computed(() => {
    const {roleType, roleId} = this.navigationService.extractRoleDetails();
    if (this.isDetailPage()) {
      if (this.router.url.includes('/news')) {
        return `app/${roleType}/${roleId}/news`;
      }
      if (this.router.url.includes('/params')) {
        return `app/${roleType}/${roleId}/params`;
      }
      if (this.router.url.includes('/teams')) {
        return `app/${roleType}/${roleId}/teams`;
      }
      if (this.router.url.includes('/club')) {
        return `app/${roleType}/${roleId}/club`;
      }
      if (this.router.url.includes('/matches')) {
        return `app/${roleType}/${roleId}/matches`;
      }
      if (this.router.url.includes('/users')) {
        return `app/${roleType}/${roleId}/users`;
      }
    }
    return `app/${roleType}/${roleId}/home`;
  });
  
  constructor() {
    this.loadCurrentRole();
  }
  
  private loadCurrentRole(): void {
    const role = this.userService.getCurrentRole();
    this.currentRole.set(role);
  }
  
  goBack() {
    this.navigationService.navigateTo([this.backUrl()]);
  }
}
