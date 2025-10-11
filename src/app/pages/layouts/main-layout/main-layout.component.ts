import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SideMenuComponent } from '../../../components/side-menu/side-menu.component';
import { Organization } from '../../../components/team-selector/team-selector.component';

@Component({
  selector: 'app-main-layout',
  template: `
    <ion-content [fullscreen]="true" class="main-layout">
      <div class="layout-container">
        <!-- Left Menu -->
        <app-side-menu 
          [activePage]="activePage()"
          [showTeamSelector]="true"
          [currentOrg]="currentOrg()"
          [organizations]="organizations()">
        </app-side-menu>

        <!-- Main Content Area -->
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [SHARED_IMPORTS, SideMenuComponent]
})
export class MainLayoutComponent {
  organizations = signal<Organization[]>([]);
  currentOrg = signal<Organization | null>(null);
  activePage = signal<'home' | 'teams' | 'search' | 'schedule' | 'tournaments' | 'settings'>('search');

  constructor(private router: Router) {
    this.loadMockData();
    
    // Listen for club selection from side menu
    window.addEventListener('clubSelected', ((event: CustomEvent) => {
      this.onClubSelected(event.detail);
    }) as EventListener);

    // Track active page based on route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActivePage(event.url);
    });

    // Set initial active page
    this.updateActivePage(this.router.url);
  }

  private updateActivePage(url: string) {
    if (url.includes('/dashboard')) {
      this.activePage.set('home');
    } else if (url.includes('/my-teams')) {
      this.activePage.set('teams');
    } else if (url.includes('/teams-search')) {
      this.activePage.set('search');
    } else {
      this.activePage.set('search'); // default
    }
  }

  private loadMockData() {
    this.organizations.set([
      {
        id: '1',
        name: 'Barcelona FC',
        location: 'Barcelona, Spain',
        imageUrl: 'https://via.placeholder.com/60x60?text=BAR'
      },
      {
        id: '2',
        name: 'Manchester United',
        location: 'Manchester, UK',
        imageUrl: 'https://via.placeholder.com/60x60?text=MAN'
      },
      {
        id: '3',
        name: 'Real Madrid',
        location: 'Madrid, Spain',
        imageUrl: 'https://via.placeholder.com/60x60?text=RMA'
      },
      {
        id: '4',
        name: 'Bayern Munich',
        location: 'Munich, Germany',
        imageUrl: 'https://via.placeholder.com/60x60?text=BAY'
      }
    ]);
  }

  onClubSelected(club: Organization) {
    this.currentOrg.set(club);
  }
}