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
  selector: 'app-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    MenuComponent,
    UserHeaderComponent
  ],
})
export class GuestPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  
  readonly memberId = signal<string>('');
  readonly currentRole = signal<Role | null>(null);
  
  readonly guestMenuConfig: MenuConfig = {
    role: RoleType.Guest,
    items: [
      { id: 'news', label: 'guest.menu.news', icon: 'newspaper-outline', route: 'news' },
      { id: 'matches', label: 'guest.menu.matches', icon: 'football-outline', route: 'matches' },
      { id: 'information', label: 'guest.menu.information', icon: 'information-circle-outline', route: 'information' },
      { id: 'sponsors', label: 'guest.menu.sponsors', icon: 'people-outline', route: 'sponsors' }
    ]
  };
  
  readonly isDetailPage = signal<boolean>(false);
  readonly backUrl = computed(() => {
    const {roleType, roleId} = this.navigationService.extractRoleDetails();
    if (this.isDetailPage()) {
      return `app/${roleType}/${roleId}/news`;
    }
    return '';
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
                     url.includes('/matches/') && url.split('/').length > 5;
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
