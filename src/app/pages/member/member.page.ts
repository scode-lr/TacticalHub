import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { MenuComponent, MenuConfig } from '@components/menu/menu.component';
import { RoleType, Role } from '@core/models/role.model';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@core/services/user.service';

export const MEMBER_MENU_CONFIG: MenuConfig = {
  role: RoleType.Member,
  items: [
    { id: 'home', label: 'user.menu.home', icon: 'home-outline', route: 'home' },
    { id: 'notifications', label: 'user.menu.notifications', icon: 'notifications-outline', route: 'notifications' },
    { id: 'news', label: 'user.menu.news', icon: 'newspaper-outline', route: 'news' },
    { id: 'forms', label: 'user.menu.forms', icon: 'document-text-outline', route: 'forms' },
    // { id: 'matches', label: 'user.menu.matches', icon: 'football-outline', route: 'matches' },
    { id: 'sponsors', label: 'user.menu.sponsors', icon: 'people-outline', route: 'sponsors', description: 'user.description.sponsors' },
  ],
  moreItems: [
    { id: 'my-documents', label: 'user.menu.myDocuments', icon: 'folder-outline', route: 'my-documents', description: 'user.description.myDocuments' },
    { id: 'information', label: 'user.menu.information', icon: 'information-circle-outline', route: 'information', description: 'user.description.information' },
    { id: 'contact', label: 'user.menu.contact', icon: 'mail-outline', route: 'contact', description: 'user.description.contact' },
  ]
};

@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonRouterOutlet,
    MenuComponent
  ],
})
export class MemberPage implements OnInit {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly memberId = signal<string>('');
  readonly currentRole = signal<Role | null>(null);

  readonly memberMenuConfig = MEMBER_MENU_CONFIG;

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
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.checkIfDetailPage();
      });
  }

  private checkIfDetailPage(): void {
    this.loadCurrentRole();
    const url = this.router.url;
    const isDetail = url.includes('/news/') && url.split('/').length > 5 ||
                     url.includes('/matches/') && url.split('/').length > 5 ||
                     url.includes('/action/') ||
                     url.includes('/forms/') && url.split('/').length > 5 ||
                     url.includes('/teams/') && url.split('/').length > 5 ||
                     url.includes('/notifications');
    this.isDetailPage.set(isDetail);
  }

  private loadCurrentRole(): void {
    const role = this.userService.getCurrentRole();
    this.currentRole.set(role);
  }
}
