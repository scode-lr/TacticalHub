import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent, MenuConfig } from '@components/menu/menu.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { RoleType, Role } from '@core/models/role.model';
import { filter } from 'rxjs/operators';
import { NavigationService } from '@services/navigation.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    MenuComponent,
    UserHeaderComponent
  ],
})
export class ViewerPage  {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  
  readonly memberId = signal<string>('');
  readonly currentRole = signal<Role | null>(null);
  
  readonly viewerMenuConfig: MenuConfig = {
    role: RoleType.Viewer,
    items: [
      { id: 'home', label: 'viewer.menu.home', icon: 'home-outline', route: 'home' },
      { id: 'news', label: 'viewer.menu.news', icon: 'newspaper-outline', route: 'news' },
      { id: 'action', label: 'viewer.menu.action', icon: 'add-circle-outline', route: 'action' },
      { id: 'information', label: 'viewer.menu.information', icon: 'information-circle-outline', route: 'information' },
      { id: 'proposals', label: 'viewer.menu.proposals', icon: 'chatbubble-ellipses-outline', route: 'proposals' },
      { id: 'matches', label: 'viewer.menu.matches', icon: 'football-outline', route: 'matches' },
      { id: 'partners', label: 'viewer.menu.partners', icon: 'people-outline', route: 'partners' }
    ]
  };
  
  readonly isDetailPage = signal<boolean>(false);
  readonly backUrl = computed(() => {
    const {roleType, roleId} = this.navigationService.extractRoleDetails();
    if (this.isDetailPage()) {
      if (this.router.url.includes('/action')) {
        return `app/${roleType}/${roleId}/action`;
      }
      
      return `app/${roleType}/${roleId}/news`;
    }
    return '';
  });
  
  constructor() {
    this.loadCurrentRole();
  }
  
  private loadCurrentRole(): void {
    const role = this.userService.getCurrentRole();
    this.currentRole.set(role);
    console.log('ViewerPage loaded current role:', role);
  }
  
  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
