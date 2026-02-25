import { Injectable, inject, signal } from '@angular/core';
import { NavigationService } from './navigation.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { ClubService } from './club.service';
import { StorageService } from './storage.service';
import { User } from '@core/models/user.model';
import { Role, RoleStatus, RoleType } from '@core/models/role.model';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { environment } from '@environment';
import { Club } from '@core/models';

export interface LoadingState {
  messageKey: string;
  subMessageKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly clubService = inject(ClubService);
  private readonly storageService = inject(StorageService);

  readonly state = signal<LoadingState>({
    messageKey: 'loading.signingIn',
    subMessageKey: 'loading.pleaseWait'
  });

  async handleGuestAccess(): Promise<void> {
    console.log('Handling guest access');
    const guestUser: User | null = this.userService.getCurrentUser();
    if (!guestUser) {
      this.redirectToSignIn();
      return;
    }
    if (this.isPrivateApp()) {
      await this.fetchAndSetupGuestRole(guestUser);
      return;
    }

    await this.delay(1000);
    this.navigationService.navigateTo(['teams/join']);
  }

  async handleUserAccess(): Promise<void> {
    this.updateState('loading.signingIn', 'loading.pleaseWait');

    const user = await this.loadUserData();
    console.log('Loaded user:', user);
    if (!user) {
      this.redirectToSignIn();
      return;
    }

    if(this.isPrivateApp() && (user?.roles && user.roles.length === 1 && user.roles[0].status === RoleStatus.Active)) {
      this.redirectToRoleHome(user.roles[0]);
      return;
    }

    this.updateState('loading.allSet', 'loading.redirecting');
    await this.delay(1000);

    this.determineUserNavigation(user);
  }

  private redirectToRoleHome(role: Role) {
    this.storageService.set(STORAGE_KEYS.SELECTED_ROLE, role);
    this.navigationService.navigateTo([`/app/${role.roleId}/${role.id}/home`]);
  }

  private async fetchAndSetupGuestRole(guestUser: User): Promise<void> {
    const club = await this.fetchInternalClub();
    if (!club) {
      this.navigationService.navigateTo(['teams/join']);
      return;
    }

    const guestRole: Role = {
      id: club.id,
      clubName: club.name,
      roleId: RoleType.Guest,
      clubId: club.id,
      clubLogo: club.logo,
      createdAt: new Date()
    };

    const userWithRole: User = {
      ...guestUser,
      roles: [guestRole]
    };

    this.userService.setUser(userWithRole);
    this.storageService.set(STORAGE_KEYS.SELECTED_ROLE, guestRole);

    this.updateState('loading.allSet', 'loading.redirecting');
    await this.delay(1000);
    this.navigationService.navigateTo([`/app/${RoleType.Guest}/${club.id}/home`]);
  }

  private async loadUserData(): Promise<User | null> {
    if (!this.userService.isAuthenticated()) {
      this.redirectToSignIn();
      return null;
    }

    const storedUser = this.userService.getCurrentUser();
    if (!storedUser) {
      this.redirectToSignIn();
      return null;
    }

    this.updateState('loading.loadingProfile', 'loading.pleaseWait');
    const fullUser = await this.userService.fetchUserProfile();

    if (!fullUser) {
      this.redirectToSignIn();
      return null;
    }

    await this.delay(1000);
    this.updateState('loading.preparingWorkspace', 'loading.pleaseWait');
    await this.delay(1000);

    return fullUser;
  }

  private async fetchInternalClub(): Promise<Club | null> {
    const clubId = this.clubService.getInternalClubId();
    if (!clubId) return null;

    this.updateState('loading.loadingClub', 'loading.pleaseWait');
    const club = await this.clubService.fetchClubById(clubId);

    if (club) {
      this.clubService.saveClubInfo(club);
    }
    return club
  }

  private determineUserNavigation(user: User): void {
    const rolesCount = user.roles?.length || 0;

    if (rolesCount === 0) {
      this.navigationService.navigateTo(['teams/join']);
    } else if (rolesCount === 1) {
      const selectedRole = user.roles![0];
      this.storageService.set(STORAGE_KEYS.SELECTED_ROLE, selectedRole);
      this.navigationService.navigateTo([`/app/${selectedRole.roleId}/${selectedRole.id}/home`]);
    } else {
      this.navigationService.navigateTo(['teams/selection']);
    }
  }

  private redirectToSignIn(): void {
    this.authService.signOut();
  }

  private isPrivateApp(): boolean {
    return !!environment.private;
  }

  private updateState(messageKey: string, subMessageKey: string): void {
    this.state.set({ messageKey, subMessageKey });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
