import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent, MenuConfig } from '@components/menu/menu.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { RoleType, Role } from '@core/models/role.model';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class ViewerPage implements OnInit {
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
      { id: 'notifications', label: 'viewer.menu.notifications', icon: 'notifications-outline', route: 'notifications' },
      // { id: 'news', label: 'viewer.menu.news', icon: 'newspaper-outline', route: 'news' },
      { id: 'forms', label: 'viewer.menu.forms', icon: 'document-text-outline', route: 'forms' },
      // { id: 'matches', label: 'viewer.menu.matches', icon: 'football-outline', route: 'matches' },
      { id: 'information', label: 'viewer.menu.information', icon: 'information-circle-outline', route: 'information' },
      // { id: 'proposals', label: 'viewer.menu.proposals', icon: 'chatbubble-ellipses-outline', route: 'proposals' },
      // { id: 'partners', label: 'viewer.menu.partners', icon: 'people-outline', route: 'partners' },
      // { id: 'proposals', label: 'viewer.menu.proposals', icon: 'chatbubble-ellipses-outline', route: 'proposals' },
      // { id: 'partners', label: 'viewer.menu.partners', icon: 'people-outline', route: 'partners' }
    ]
  };
  
  readonly isDetailPage = signal<boolean>(false);
  readonly backUrl = computed(() => {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    if (!this.isDetailPage()) return '';

    const url = this.router.url;

    const formSubmissionMatch = url.match(/\/forms\/(\d+)\/(-?\d+)/);
    if (formSubmissionMatch) {
      return `/app/${roleType}/${roleId}/forms/${formSubmissionMatch[1]}`;
    }
    if (url.includes('/forms/')) {
      return `/app/${roleType}/${roleId}/forms`;
    }
    if (url.includes('/news/')) {
      return `/app/${roleType}/${roleId}/news`;
    }
    if (url.includes('/matches/')) {
      return `/app/${roleType}/${roleId}/matches`;
    }
    return `/app/${roleType}/${roleId}/home`;
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
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.checkIfDetailPage();
      });
  }

  private checkIfDetailPage(): void {
    const url = this.router.url;
    const isDetail = url.includes('/news/') && url.split('/').length > 5 ||
                     url.includes('/matches/') && url.split('/').length > 5 ||
                     url.includes('/action/') ||
                     url.includes('/forms/') && url.split('/').length > 5 ||
                     url.includes('/teams/') && url.split('/').length > 5;
    this.isDetailPage.set(isDetail);
  }
  
  private loadCurrentRole(): void {
    const role = this.userService.getCurrentRole();
    this.currentRole.set(role);
  }
  
  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
