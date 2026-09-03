import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { MobileNavigationService } from '@services/mobile-navigation.service';
import { UserService } from '@services/user.service';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { User } from '@core/models/user.model';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { addIcons } from 'ionicons';
import { alertCircleOutline, closeOutline, trashOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonIcon,
    TranslatePipe,
    UserHeaderComponent,
    BackButtonComponent
  ]
})
export class ProfilePage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  readonly mobileNavigation = inject(MobileNavigationService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly user = signal<User | null>(null);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly showDeleteConfirmation = signal<boolean>(false);
  readonly showDeletePassword = signal<boolean>(false);

  profileForm: FormGroup;
  deleteAccountForm: FormGroup;

  constructor() {
    addIcons({ alertCircleOutline, closeOutline, trashOutline, eyeOutline, eyeOffOutline });
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
    this.deleteAccountForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.patchFormValues(currentUser);
    }
  }

  patchFormValues(user: User) {
    this.profileForm.patchValue({
      email: user.email,
      firstName: user.metadata?.firstName,
      lastName: user.metadata?.lastName
    });
  }

  async saveProfile() {
    if (this.profileForm.invalid || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);

    const currentUser = this.user();
    if (!currentUser) {
      this.isSaving.set(false);
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      metadata: {
        ...currentUser.metadata,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName
      }
    };

    this.userService.setUser(updatedUser);
    this.user.set(updatedUser);

    setTimeout(() => {
      this.isSaving.set(false);
    }, 500);
  }

  goBack() {
    const backUrl = this.mobileNavigation.accountBackUrl();
    if (backUrl) this.navigationService.navigateTo([backUrl]);
    else this.navigationService.goBack();
  }

  openDeleteConfirmation(): void {
    this.showDeleteConfirmation.set(true);
  }

  cancelDeleteAccount(): void {
    if (this.isDeleting()) return;
    this.showDeleteConfirmation.set(false);
    this.showDeletePassword.set(false);
    this.deleteAccountForm.reset();
  }

  toggleDeletePassword(): void {
    this.showDeletePassword.update(v => !v);
  }

  async deleteAccount(): Promise<void> {
    if (this.deleteAccountForm.invalid || this.isDeleting()) return;

    this.isDeleting.set(true);
    const result = await this.authService.deleteAccount(this.deleteAccountForm.value.currentPassword);
    this.isDeleting.set(false);

    if (!result.success) {
      this.toastService.show(result.message, 'danger');
    }
  }
}
