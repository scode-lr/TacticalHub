import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonAvatar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@services/navigation.service';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model';
import { MockAuthService } from '../../../core/services/mock-auth.service';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.page.html',
  styleUrls: ['./role-selection.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonAvatar,
    IonButton,
    IonIcon
  ]
})
export class RoleSelectionPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly mockAuthService = inject(MockAuthService);
  
  user: User | null = null;

  constructor() {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const storedUser = this.mockAuthService.getStoredUser();
    if (storedUser) {
      this.user = Object.assign(new User(), storedUser);
    } else {
      // If no user data, redirect to sign in
      this.navigationService.navigateTo(['/auth/signin']);
    }
  }

  selectRole(role: Role) {
    // Store selected role
    localStorage.setItem('selectedRole', JSON.stringify(role));
    
    // Navigate to main app
    this.navigationService.navigateTo(['/layouts/my-teams']);
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

  logout() {
    this.mockAuthService.clearAuthData();
    this.navigationService.navigateTo(['/auth/signin']);
  }
}
