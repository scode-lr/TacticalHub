import { signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { environment } from '@environment';
import { RoleSelectorComponent } from './role-selector.component';
import { Role, RoleType } from '@core/models/role.model';
import { User } from '@core/models/user.model';
import { AppStatus } from '@core/models/app-status.model';
import { UserService } from '@services/user.service';
import { RolesService } from '@services/roles.service';
import { NavigationService } from '@services/navigation.service';
import { TranslationService } from '@services/i18n/translation.service';
import { NotificationsService } from '@services/notifications.service';
import { InboxService } from '@services/inbox.service';

describe('RoleSelectorComponent private club context', () => {
  const config = environment as typeof environment & { clubId?: number };
  const originalPrivate = config.private;
  const originalClubId = config.clubId;
  const member: Role = { id: 10, clubId: 1, roleId: RoleType.Member, status: AppStatus.Active };
  const admin: Role = { id: 11, clubId: 1, roleId: RoleType.Admin, status: AppStatus.Active };
  const otherClub: Role = { id: 20, clubId: 2, roleId: RoleType.Admin, status: AppStatus.Active };
  const pending: Role = { id: 12, clubId: 1, roleId: RoleType.Coach, status: AppStatus.Pending };
  let fixture: ComponentFixture<RoleSelectorComponent>;
  const user = signal<User>({ id: 1, email: 'test@example.test', roles: [] });
  let rolesService: jasmine.SpyObj<RolesService>;
  let navigation: jasmine.SpyObj<NavigationService>;
  let notifications: jasmine.SpyObj<NotificationsService>;
  let inbox: jasmine.SpyObj<InboxService>;

  beforeEach(() => {
    config.private = true;
    config.clubId = 1;
    user.set({ id: 1, email: 'test@example.test', roles: [member, admin, otherClub, pending] });
    rolesService = jasmine.createSpyObj('RolesService', ['getCurrentRole', 'setSelectedRole']);
    rolesService.getCurrentRole.and.returnValue(member);
    navigation = jasmine.createSpyObj('NavigationService', ['navigateTo']);
    notifications = jasmine.createSpyObj('NotificationsService', ['clearAllNotifications']);
    inbox = jasmine.createSpyObj('InboxService', ['clearMessages']);
    TestBed.configureTestingModule({
      imports: [RoleSelectorComponent],
      providers: [
        { provide: UserService, useValue: { getCurrentUser: () => user() } },
        { provide: RolesService, useValue: rolesService },
        { provide: NavigationService, useValue: navigation },
        { provide: TranslationService, useValue: { instant: (key: string) => key } },
        { provide: NotificationsService, useValue: notifications },
        { provide: InboxService, useValue: inbox },
      ],
    });
  });

  afterEach(() => {
    config.private = originalPrivate;
    if (originalClubId === undefined) delete config.clubId;
    else config.clubId = originalClubId;
  });

  function create(currentRole: Role | null = member): RoleSelectorComponent {
    fixture = TestBed.createComponent(RoleSelectorComponent);
    fixture.componentRef.setInput('currentRole', currentRole);
    fixture.componentRef.setInput('asMenuItem', true);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('offers only operational roles from the configured private club', () => {
    const component = create();
    expect(component.availableRoles()).toEqual([member, admin]);
    expect(component.isRoleSelectorDisabled()).toBeFalse();
  });

  it('hides the switch when only one role is usable in the club', () => {
    user.update(value => ({ ...value, roles: [member, pending, otherClub] }));
    const component = create();
    expect(fixture.nativeElement.querySelector('.role-menu-item')).toBeNull();
    component.openRoleSelector();
    expect(component.isModalOpen()).toBeFalse();
  });

  it('updates the choices when the current user roles change', () => {
    const component = create();
    expect(component.availableRoles().length).toBe(2);
    user.update(value => ({ ...value, roles: [member] }));
    fixture.detectChanges();
    expect(component.availableRoles()).toEqual([member]);
    expect(fixture.nativeElement.querySelector('.role-menu-item')).toBeNull();
  });

  it('uses the active club when private configuration has no clubId', () => {
    delete config.clubId;
    const component = create(otherClub);
    expect(component.availableRoles()).toEqual([otherClub]);
    fixture.componentRef.setInput('currentRole', null);
    expect(component.availableRoles()).toEqual([]);
  });

  it('keeps the multiclub list for a public app', () => {
    config.private = false;
    expect(create().availableRoles()).toEqual([member, admin, otherClub, pending]);
  });

  it('does not apply a foreign or pending role passed directly to the selector', () => {
    const component = create();
    component.selectRole(otherClub);
    component.selectRole(pending);
    expect(rolesService.setSelectedRole).not.toHaveBeenCalled();
    expect(navigation.navigateTo).not.toHaveBeenCalled();
  });

  it('closes the sheet and updates the context when switching roles', fakeAsync(() => {
    const component = create();
    component.isModalOpen.set(true);
    component.selectRole(admin);
    expect(component.isModalOpen()).toBeFalse();
    expect(rolesService.setSelectedRole).toHaveBeenCalledWith(admin);
    expect(notifications.clearAllNotifications).toHaveBeenCalled();
    expect(inbox.clearMessages).toHaveBeenCalled();
    tick(200);
    expect(navigation.navigateTo).toHaveBeenCalledWith(['app/1/11/home']);
  }));

  it('closes without resetting the current context when choosing the active role', () => {
    const component = create();
    component.isModalOpen.set(true);
    component.selectRole(member);
    expect(component.isModalOpen()).toBeFalse();
    expect(rolesService.setSelectedRole).not.toHaveBeenCalled();
    expect(notifications.clearAllNotifications).not.toHaveBeenCalled();
    expect(navigation.navigateTo).not.toHaveBeenCalled();
  });
});
