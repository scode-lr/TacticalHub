import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { RoleType } from '@models/role.model';
import { NavigationService } from './navigation.service';
import { RolesService } from './roles.service';

/** Drives the mobile "More" account navigation, shared by every app. */
@Injectable({ providedIn: 'root' })
export class MobileNavigationService {
  private readonly router = inject(Router);
  private readonly navigation = inject(NavigationService);
  private readonly roles = inject(RolesService);
  private readonly media = inject(DOCUMENT).defaultView?.matchMedia('(max-width: 768px)');
  private readonly isMobile = signal(this.media?.matches ?? false);

  readonly accountInMore = computed(() => this.isMobile());

  constructor() {
    const update = (event: MediaQueryListEvent) => this.isMobile.set(event.matches);
    this.media?.addEventListener('change', update);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', update));
  }

  openAccount(page: 'profile' | 'settings'): void {
    this.navigation.navigateTo([`/${page}`], { queryParams: { from: 'more' } });
  }

  accountBackUrl(): string | null {
    // Preserve the origin after refresh or rotation. Never accept an arbitrary
    // return URL: rebuild it from the selected role, with existing route guards.
    if (this.router.parseUrl(this.router.url).queryParams['from'] !== 'more') return null;
    const role = this.roles.getCurrentRole();
    if (!role || ![RoleType.Admin, RoleType.Member, RoleType.Guest].includes(role.roleId)) return null;
    const id = role.roleId === RoleType.Guest ? role.clubId : role.id;
    return `/app/${role.roleId}/${id}/more`;
  }
}
