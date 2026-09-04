import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from '@services/user.service';
import { RolesService } from '@services/roles.service';
import { NavigationService } from '@services/navigation.service';
import { MobileNavigationService } from '@services/mobile-navigation.service';
import { NotificationsService } from '@services/notifications.service';
import { InboxService } from '@services/inbox.service';
import { TranslationService } from '@services/i18n/translation.service';
import { Role, RoleType } from '@models/role.model';
import { User } from '@models/user.model';
import { MorePage } from './more.page';
import { MenuComponent } from '@components/menu/menu.component';
import { GUEST_MENU_CONFIG } from '../guest/guest.page';

describe('More mobile navigation', () => {
  const member: Role = { id: 10, clubId: 1, clubName: 'Club', roleId: RoleType.Member };
  const admin: Role = { id: 11, clubId: 1, clubName: 'Club', roleId: RoleType.Admin };
  const guest: Role = { id: 99, clubId: 1, clubName: 'Club', roleId: RoleType.Guest };
  let role: Role;
  let user: ReturnType<typeof signal<User>>;
  let accountInMore: ReturnType<typeof signal<boolean>>;
  let events: Subject<NavigationEnd>;
  let fixture: ComponentFixture<MorePage>;
  let navigation: jasmine.SpyObj<NavigationService>;
  let openAccount: jasmine.Spy;
  let logout: jasmine.Spy;
  let router: { events: Subject<NavigationEnd>; url: string };

  beforeEach(() => {
    role = member;
    user = signal<User>({ id: 1, email: 'user@example.test', roles: [member, admin] });
    accountInMore = signal(true);
    events = new Subject<NavigationEnd>();
    router = { events, url: '/app/3/10/more' };
    navigation = jasmine.createSpyObj('NavigationService', ['navigateTo', 'getMenuIdFromUrl']);
    navigation.getMenuIdFromUrl.and.returnValue('more');
    openAccount = jasmine.createSpy('openAccount');
    logout = jasmine.createSpy('logout').and.resolveTo();
    TestBed.configureTestingModule({ imports: [MorePage, MenuComponent], providers: [
      { provide: UserService, useValue: { getCurrentRole: () => role, getCurrentUser: () => user(), getStoredUser: () => user(), logout } },
      { provide: MobileNavigationService, useValue: { accountInMore, openAccount } },
      { provide: NavigationService, useValue: navigation },
      { provide: Router, useValue: router },
      { provide: ActivatedRoute, useValue: {} },
      { provide: RolesService, useValue: { getCurrentRole: () => role } },
      { provide: NotificationsService, useValue: { getUnreadCount: () => 0, getPendingSubmissionsCount: () => 0 } },
      { provide: InboxService, useValue: { getUnreadCount: () => 0 } },
      { provide: TranslationService, useValue: { instant: (key: string) => key } },
    ] });
  });

  function create(): MorePage {
    fixture = TestBed.createComponent(MorePage);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function click(label: string): void {
    const button = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(item => item.querySelector('.action-row-title')?.textContent?.trim() === label);
    expect(button).withContext(label).toBeDefined();
    button?.click();
  }

  it('keeps member services and exposes account actions', () => {
    const page = create();
    expect(page.items().map(item => item.id)).toEqual(['my-documents', 'information', 'contact']);
    click('common.profile');
    click('common.settings');
    expect(openAccount.calls.allArgs()).toEqual([['profile'], ['settings']]);
  });

  it('keeps club administration distinct from personal settings', () => {
    role = admin;
    const page = create();
    expect(page.items().map(item => item.id)).toEqual(['settings-club', 'users']);
    click('more.clubSettings');
    expect(navigation.navigateTo).toHaveBeenCalledWith(['/app/1/11/settings-club']);
    click('common.settings');
    expect(openAccount).toHaveBeenCalledWith('settings');
  });

  it('shows guest services without profile, password settings or role switching', () => {
    role = guest;
    user.set({ id: 0, email: '', isGuest: true, roles: [guest] });
    const page = create();
    expect(page.items().map(item => item.id)).toEqual(['information', 'contact']);
    expect(fixture.nativeElement.textContent).not.toContain('common.profile');
    expect(fixture.nativeElement.textContent).not.toContain('common.settings');
    expect(fixture.nativeElement.querySelector('app-role-selector')).toBeNull();
    click('guest.menu.information');
    expect(navigation.navigateTo).toHaveBeenCalledWith(['/app/4/1/information']);
    page.openAccount('profile');
    expect(openAccount).not.toHaveBeenCalled();
  });

  it('refreshes cached role context and user identity', () => {
    const page = create();
    role = admin;
    events.next(new NavigationEnd(2, '/app/1/11/more', '/app/1/11/more'));
    user.update(value => ({ ...value, metadata: { firstName: 'Updated', lastName: 'Name' } }));
    fixture.detectChanges();
    expect(page.items().map(item => item.id)).toEqual(['settings-club', 'users']);
    expect(fixture.nativeElement.textContent).toContain('Updated Name');
  });

  it('leaves the existing services view when mobile migration is disabled', () => {
    accountInMore.set(false);
    const page = create();
    expect(page.items().length).toBe(3);
    expect(fixture.nativeElement.querySelector('app-account-identity')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('common.profile');
    expect(fixture.nativeElement.querySelector('.action-row.compact')).toBeNull();
  });

  it('closes the session only once while signing out', async () => {
    const page = create();
    const pending = page.logout();
    await page.logout();
    await pending;
    expect(logout).toHaveBeenCalledTimes(1);
    expect(page.isSigningOut()).toBeFalse();
  });

  it('moves guest information to More only in the mobile variant', () => {
    const menu = TestBed.createComponent(MenuComponent);
    menu.componentRef.setInput('config', GUEST_MENU_CONFIG);
    menu.componentRef.setInput('currentRole', guest);
    menu.detectChanges();
    expect(menu.componentInstance.mobileMenuItems().map(item => item.id)).toEqual(['home', 'news', 'matches', 'sponsors']);
    expect(menu.componentInstance.showMore()).toBeTrue();
    menu.componentInstance.goToMore();
    expect(navigation.navigateTo).toHaveBeenCalledWith(['/app/4/1/more']);
    accountInMore.set(false);
    menu.detectChanges();
    expect(menu.componentInstance.mobileMenuItems().map(item => item.id)).toEqual(['home', 'news', 'matches', 'information', 'sponsors']);
    expect(menu.componentInstance.showMore()).toBeFalse();
    expect(menu.componentInstance.config().items).toBe(GUEST_MENU_CONFIG.items);
  });

  it('waits for menu inputs before observing navigation events', () => {
    const menu = TestBed.createComponent(MenuComponent);
    events.next(new NavigationEnd(1, '/app/4/1/more', '/app/4/1/more'));
    menu.componentRef.setInput('config', GUEST_MENU_CONFIG);
    menu.componentRef.setInput('currentRole', guest);
    menu.detectChanges();
    expect(menu.componentInstance.isMoreActive()).toBeTrue();
  });
});
