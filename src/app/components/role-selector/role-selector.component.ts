import { Component, inject, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonModal,
  IonIcon,
  IonAvatar,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronDownOutline,
  closeOutline,
  briefcaseOutline
} from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UserService } from '@core/services/user.service';
import { StorageService } from '@core/services/storage.service';
import { NavigationService } from '@services/navigation.service';
import { TranslationService } from '@services/i18n/translation.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { Role, RoleType } from '@core/models/role.model';
import { DefaultImageDirective } from '@core/directives/default-image.directive';


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
    IonBadge,
    TranslatePipe,
    DefaultImageDirective
  ]
})
export class RoleSelectorComponent {
  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);

  readonly isModalOpen = signal<boolean>(false);
  readonly currentRole = input<Role | null>();
  readonly isRoleSelectorDisabled = computed(() => this.currentRole()?.roleId === RoleType.Guest);
  readonly availableRoles = computed(() => {
    const user = this.userService.getStoredUser();
    return user?.roles || [];
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
      briefcaseOutline
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
      case RoleType.Viewer:
        roleName = 'viewer';
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
    this.storageService.set<Role>(STORAGE_KEYS.SELECTED_ROLE, role);
    
    this.closeRoleSelector();
    
    setTimeout(() => {
        this.navigationService.navigateTo([`app/${role.roleId}/${role.id}/home`]);
    }, 200);
  }

  hasMultipleRoles(): boolean {
    return this.availableRoles().length > 0;
  }

  addNewTeam() {
    this.closeRoleSelector();
    setTimeout(() => {
      this.navigationService.navigateTo(['teams/join']);
    }, 200);
  }
}
