import { Component, OnInit, inject, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@services/navigation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthBrandingComponent } from '../components/auth-branding/auth-branding.component';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { StorageService } from '@services/storage.service';
import { User } from '@core/models/user.model';
import { STORAGE_KEYS } from '@core/constants/storage-keys';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    AuthBrandingComponent,
    TranslatePipe
  ]
})
export class LoadingPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  
  readonly loadingMessageKey = signal<string>('loading.signingIn');
  readonly loadingSubMessageKey = signal<string>('loading.pleaseWait');

  async ngOnInit() {
    const user = await this.loadUserData();
    if (!user) {
      this.authService.signOut();
      this.navigationService.navigateTo(['auth/signin']);
      return;
    }
    
    this.loadingMessageKey.set('loading.allSet');
    this.loadingSubMessageKey.set('loading.redirecting');
    await this.delay(500);

    this.determineNavigation(user);
  }

  private async loadUserData(): Promise<User | null> {
    if (!this.userService.isAuthenticated()) {
      this.authService.signOut();
      this.navigationService.navigateTo(['auth/signin']);
      return null;
    }

    const storedUser = this.userService.getCurrentUser();
    if (!storedUser) {
      this.navigationService.navigateTo(['auth/signin']);
      return null;
    }
    
    this.loadingMessageKey.set('loading.loadingProfile');
    const fullUser = await this.userService.fetchUserProfile(storedUser.id);
    
    if (!fullUser) {
      this.navigationService.navigateTo(['auth/signin']);
      return null;
    }

    await this.delay(1800);
    this.loadingMessageKey.set('loading.preparingWorkspace');
    await this.delay(1800);
    return fullUser;

  }

  private determineNavigation(user: User): void {
    const rolesCount = user.roles?.length || 0;

    if (rolesCount === 0) {
      this.navigationService.navigateTo(['teams/join']);
    } else if (rolesCount === 1) {
      const selectedRole = user.roles![0];
      this.storageService.set(STORAGE_KEYS.SELECTED_ROLE, selectedRole);
      this.navigationService.navigateTo(['layouts/my-teams']);
    } else {
      this.navigationService.navigateTo(['teams/selection']);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
