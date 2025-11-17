import { Component, OnInit, inject, signal } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@services/navigation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { User } from '@core/models/user.model';
import { Role } from '@core/models/role.model';
import { UserService } from '@core/services/user.service';
import { StorageService } from '@core/services/storage.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { RoleCardComponent } from '@components/role-card/role-card.component';
import { environment } from '@environment';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    TranslatePipe,
    UserHeaderComponent,
    RoleCardComponent
  ]
})
export class RoleSelectionPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  
  user: User | null = null;
  readonly hasRoles = signal<boolean>(true);
  readonly isPrivateApp = environment.private;

  ngOnInit() {
    this.loadUserData();
    this.checkRolesStatus();
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
    this.hasRoles.set(hasRolesValue?.length! > 0);
  }

  selectRole(role: Role) {
    this.storageService.set<Role>(STORAGE_KEYS.SELECTED_ROLE, role);
    this.navigationService.navigateTo(['layouts/my-teams']);
  }

  addNewClub() {
    this.navigationService.navigateTo(['teams/join']);
  }

  skipForNow() {
    this.navigationService.navigateTo(['layouts/my-teams']);
  }
}
