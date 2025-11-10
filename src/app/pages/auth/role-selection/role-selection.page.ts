import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonAvatar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
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
  user: User | null = null;

  constructor(
    private router: Router,
    private mockAuthService: MockAuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const storedUser = this.mockAuthService.getStoredUser();
    if (storedUser) {
      this.user = Object.assign(new User(), storedUser);
    } else {
      // If no user data, redirect to sign in
      this.router.navigate(['/auth/signin']);
    }
  }

  selectRole(role: Role) {
    // Store selected role
    localStorage.setItem('selectedRole', JSON.stringify(role));
    
    // Navigate to main app
    this.router.navigate(['/layouts/my-teams']);
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
    this.router.navigate(['/auth/signin']);
  }
}
