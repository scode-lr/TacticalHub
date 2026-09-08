import { Component, inject, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonModal,
  IonIcon,
  IonAvatar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronDownOutline,
  closeOutline,
  briefcaseOutline,
  swapHorizontalOutline
} from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UserService } from '@core/services/user.service';
import { NavigationService } from '@services/navigation.service';
import { TranslationService } from '@services/i18n/translation.service';
import { Role, RoleType } from '@core/models/role.model';
import { AppStatus } from '@core/models/app-status.model';
import { DefaultImageDirective } from '@core/directives/default-image.directive';
import { RolesService } from '@services/roles.service';
import { NotificationsService } from '@services/notifications.service';
import { InboxService } from '@services/inbox.service';
import { RoleCardComponent } from '@components/role-card/role-card.component';
import { environment } from '@environment';


@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonModal,
    IonIcon,
    IonAvatar,
    TranslatePipe,
    DefaultImageDirective,
    RoleCardComponent
  ]
})
export class RoleSelectorComponent {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly roleService = inject(RolesService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly inboxService = inject(InboxService);

  readonly isModalOpen = signal<boolean>(false);
  readonly isPrivateApp = environment.private;
  readonly currentRole = input<Role | null>();
  readonly asMenuItem = input<boolean>(false);
  readonly isRoleSelectorDisabled = computed(() =>
    this.currentRole()?.roleId === RoleType.Guest || this.availableRoles().length <= 1
  );
  readonly availableRoles = computed(() => {
    const roles = this.userService.getCurrentUser()?.roles ?? [];
    if (!this.isPrivateApp) return roles;

    // A private app belongs to its configured club. Use the active club only
    // when a private deployment has no clubId in its project configuration.
    const clubId = (environment as { clubId?: number }).clubId ?? this.currentRole()?.clubId;
    return roles.filter(role => role.clubId === clubId &&
      role.status !== AppStatus.Pending && role.status !== AppStatus.Draft);
  });

  readonly currentRoleName = computed(() => {
    const role = this.currentRole();
    if (!role?.roleId) return 'Unknown';
    
    return this.getRoleName(role.roleId);
  });

  constructor() {
    addIcons({
      chevronDownOutline,
      closeOutline,
      briefcaseOutline,
      swapHorizontalOutline
    });
  }

  getRoleName(roleType: RoleType): string {
    let roleName: string;
    switch (roleType) {
      case RoleType.Admin:
        roleName = 'admin';
        break;
      case RoleType.Coach:
        roleName = 'coach';
        break;
      case RoleType.Member:
        roleName = 'member';
        break;
      case RoleType.Guest:
        roleName = 'guest';
        break;
      default:
        return 'Unknown';
    }
    return this.translationService.instant(`roles.${roleName}`);
  }

  openRoleSelector() {
    if (this.isRoleSelectorDisabled()) {
      return;
    }
    this.isModalOpen.set(true);
  }

  closeRoleSelector() {
    this.isModalOpen.set(false);
  }

  selectRole(role: Role) {
    if (this.isPrivateApp) {
      if (this.isRoleSelectorDisabled() || !this.availableRoles().some(available => available.id === role.id)) return;
      if (role.id === this.currentRole()?.id) {
        this.closeRoleSelector();
        return;
      }
    }
    const previousRoleId = this.roleService.getCurrentRole()?.id;
    this.roleService.setSelectedRole(role);
    if (previousRoleId !== role.id) {
      this.notificationsService.clearAllNotifications();
      this.inboxService.clearMessages();
    }
    this.closeRoleSelector();
    
    setTimeout(() => {
        this.navigationService.navigateTo([`app/${role.roleId}/${role.id}/home`]);
    }, 200);
  }

  hasMultipleRoles(): boolean {
    return this.availableRoles().length > 1;
  }

  addNewTeam() {
    this.closeRoleSelector();
    setTimeout(() => {
      this.navigationService.navigateTo(['teams/join']);
    }, 200);
  }
}
