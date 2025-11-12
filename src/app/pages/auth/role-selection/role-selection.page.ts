import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { IonContent, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@services/navigation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { User } from '@core/models/user.model';
import { Role } from '@core/models/role.model';
import { UserService } from '@core/services/user.service';
import { StorageService } from '@core/services/storage.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.page.html',
  styleUrls: ['./role-selection.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonAvatar,
    IonIcon,
    IonButton,
    TranslatePipe
  ]
})
export class RoleSelectionPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  
  user: User | null = null;
  readonly showUserMenu = signal<boolean>(false);
  readonly hasRoles = signal<boolean>(true);

  ngOnInit() {
    this.loadUserData();
    this.checkRolesStatus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu') && !target.closest('.user-dropdown')) {
      this.showUserMenu.set(false);
    }
  }

  loadUserData() {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.user = storedUser;
    } else {
      this.navigationService.navigateTo(['signin']);
    }
  }

  checkRolesStatus() {
    const hasRolesValue = this.user?.roles;
    this.hasRoles.set(hasRolesValue?.length! > 50);
  }

  toggleUserMenu() {
    this.showUserMenu.set(!this.showUserMenu());
  }

  selectRole(role: Role) {
    this.storageService.set<Role>(STORAGE_KEYS.SELECTED_ROLE, role);
    this.navigationService.navigateTo(['layouts/my-teams']);
  }

  getRoleIcon(roleName: string): string {
    const iconMap: { [key: string]: string } = {
      'Player': 'football-outline',
      'Coach': 'clipboard-outline',
      'Admin': 'shield-checkmark-outline',
      'Manager': 'briefcase-outline'
    };
    return iconMap[roleName] || 'person-outline';
  }

  addNewClub() {
    this.navigationService.navigateTo(['teams-search']);
  }

  skipForNow() {
    this.navigationService.navigateTo(['layouts/my-teams']);
  }

  logout() {
    this.showUserMenu.set(false);
    this.userService.logout();
  }
}
