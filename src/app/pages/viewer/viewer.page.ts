import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent, MenuConfig } from '@components/menu/menu.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { RoleType } from '@core/models/role.model';
import { filter } from 'rxjs/operators';

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
    if (this.isDetailPage()) {
      const urlSegments = this.router.url.split('/');
      const roleId = urlSegments[2];
      
      if (this.router.url.includes('/action-form/')) {
        return `/app/${roleId}/action`;
      }
      
      return `/app/${roleId}/news`;
    }
    return '';
  });
  
  constructor() {
    this.trackRouteChanges();
  }
  
  private trackRouteChanges() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const isNewsDetail = url.includes('/news/') && url.split('/').length > 4;
        const isActionForm = url.includes('/action-form/');
        const isDetail = isNewsDetail || isActionForm;
        this.isDetailPage.set(isDetail);
        
        if (isDetail) {
          const contentContainer = document.querySelector('.content-container');
          if (contentContainer) {
            contentContainer.scrollTo(0, 0);
          }
        }
      });
      
    const url = this.router.url;
    const isNewsDetail = url.includes('/news/') && url.split('/').length > 4;
    const isActionForm = url.includes('/action-form/');
    const isDetail = isNewsDetail || isActionForm;
    this.isDetailPage.set(isDetail);
  }
  
  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
