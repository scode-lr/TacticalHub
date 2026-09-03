import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { environment } from '@environment';
import { Role, RoleType } from '@models/role.model';
import { MobileNavigationService } from './mobile-navigation.service';
import { NavigationService } from './navigation.service';
import { RolesService } from './roles.service';

describe('MobileNavigationService', () => {
  const originalPrivate = environment.private;
  let media: jasmine.SpyObj<MediaQueryList>;
  let selectedRole: Role | null;
  let navigation: jasmine.SpyObj<NavigationService>;
  let url: string;

  beforeEach(() => {
    environment.private = true;
    media = jasmine.createSpyObj('MediaQueryList', ['addEventListener', 'removeEventListener'], { matches: true });
    spyOn(window, 'matchMedia').and.returnValue(media);
    selectedRole = { id: 10, clubId: 1, roleId: RoleType.Member };
    url = '/profile?from=more';
    navigation = jasmine.createSpyObj('NavigationService', ['navigateTo']);
    TestBed.configureTestingModule({ providers: [
      provideRouter([]),
      { provide: NavigationService, useValue: navigation },
      { provide: RolesService, useValue: { getCurrentRole: () => selectedRole } },
    ] });
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.callFake(() => url);
  });

  afterEach(() => { environment.private = originalPrivate; });

  it('enables account navigation only within the private mobile breakpoint', () => {
    const service = TestBed.inject(MobileNavigationService);
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
    expect(service.accountInMore()).toBeTrue();
    const onChange = media.addEventListener.calls.mostRecent().args[1] as (event: MediaQueryListEvent) => void;
    onChange({ matches: false } as MediaQueryListEvent);
    expect(service.accountInMore()).toBeFalse();
    onChange({ matches: true } as MediaQueryListEvent);
    expect(service.accountInMore()).toBeTrue();
  });

  it('preserves the public app account navigation', () => {
    environment.private = false;
    const service = TestBed.inject(MobileNavigationService);
    expect(service.accountInMore()).toBeFalse();
    expect(service.accountBackUrl()).toBeNull();
  });

  it('marks account pages opened from More', () => {
    const service = TestBed.inject(MobileNavigationService);
    service.openAccount('profile');
    service.openAccount('settings');
    expect(navigation.navigateTo.calls.allArgs()).toEqual([
      [['/profile'], { queryParams: { from: 'more' } }],
      [['/settings'], { queryParams: { from: 'more' } }],
    ]);
  });

  it('rebuilds the return destination from the selected role after refresh', () => {
    const service = TestBed.inject(MobileNavigationService);
    expect(service.accountBackUrl()).toBe('/app/3/10/more');
    selectedRole = { id: 22, clubId: 1, roleId: RoleType.Admin };
    url = '/settings?from=more';
    expect(service.accountBackUrl()).toBe('/app/1/22/more');
    selectedRole = { id: 99, clubId: 1, roleId: RoleType.Guest };
    expect(service.accountBackUrl()).toBe('/app/4/1/more');
  });

  it('keeps normal history for other entry points and ignores arbitrary return URLs', () => {
    const service = TestBed.inject(MobileNavigationService);
    url = '/profile?returnUrl=https://example.test';
    expect(service.accountBackUrl()).toBeNull();
    url = '/profile?from=more&returnUrl=https://example.test';
    expect(service.accountBackUrl()).toBe('/app/3/10/more');
    selectedRole = null;
    expect(service.accountBackUrl()).toBeNull();
  });
});
