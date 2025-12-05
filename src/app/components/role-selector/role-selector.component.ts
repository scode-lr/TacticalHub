import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar
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
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { Role, RoleType, RoleStatus } from '@core/models/role.model';
import { DefaultImageDirective } from '@core/directives/default-image.directive';
import { environment } from '@environment';


@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    TranslatePipe,
    DefaultImageDirective
  ]
})
export class RoleSelectorComponent {
  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly navigationService = inject(NavigationService);

  readonly isModalOpen = signal<boolean>(false);
  readonly currentRole = signal<Role | null>(null);
  readonly availableRoles = computed(() => {
    const user = this.userService.getStoredUser();
    return user?.roles?.filter(role => 
      role.id !== this.currentRole()?.id
    ) || [];
  });
  readonly privateApp = environment.private;

  constructor() {
    addIcons({
      chevronDownOutline,
      closeOutline,
      briefcaseOutline
    });
    this.loadCurrentRole();
  }

  loadCurrentRole() {
    const role = this.storageService.get<Role>(STORAGE_KEYS.SELECTED_ROLE);
    this.currentRole.set(role);
    console.log('Current role loaded in RoleSelectorComponent:', role);
  }

  getRoleName(roleId: RoleType): string {
    switch (roleId) {
      case RoleType.Admin:
        return 'Admin';
      case RoleType.Coach:
        return 'Coach';
      case RoleType.Viewer:
        return 'Viewer';
      default:
        return 'Unknown';
    }
  }

  openRoleSelector() {
    this.isModalOpen.set(true);
  }

  closeRoleSelector() {
    this.isModalOpen.set(false);
  }

  selectRole(role: Role) {
    this.storageService.set<Role>(STORAGE_KEYS.SELECTED_ROLE, role);
    this.currentRole.set(role);
    this.closeRoleSelector();
    
    setTimeout(() => {
      if (role.roleId === RoleType.Viewer) {
        this.navigationService.navigateTo([`app/${role.roleId}`]);
      } else {
        this.navigationService.navigateTo(['layouts/my-teams']);
      }
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
