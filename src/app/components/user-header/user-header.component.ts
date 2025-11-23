import { Component, inject, signal, HostListener, input, output } from '@angular/core';
import { IonAvatar, IonIcon, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@pipes/translate.pipe';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { NavigationService } from '@services/navigation.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    IonIcon,
    IonImg,
    TranslatePipe
  ]
})
export class UserHeaderComponent {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  
  readonly showBackButton = input<boolean>(false);
  readonly backClick = output<void>();
  
  user: User | null = null;
  readonly showUserMenu = signal<boolean>(false);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');

  ngOnInit() {
    this.loadUserData();
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
      this.avatarUrl.set(storedUser.avatarUrl || 'assets/default-avatar.svg');
    }
  }

  onAvatarError() {
    this.avatarUrl.set('assets/default-avatar.svg');
  }

  toggleUserMenu() {
    this.showUserMenu.set(!this.showUserMenu());
  }

  onBackClick() {
    this.backClick.emit();
  }

  goToSettings() {
    this.showUserMenu.set(false);
    this.navigationService.navigateTo(['/settings']);
  }

  logout() {
    this.showUserMenu.set(false);
    this.userService.logout();
  }
}
