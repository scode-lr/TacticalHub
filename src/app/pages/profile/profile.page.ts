import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonIcon, IonSpinner, IonModal } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { MobileNavigationService } from '@services/mobile-navigation.service';
import { DEFAULT_AVATAR, UserService } from '@services/user.service';
import { FileValidationService } from '@services/file-validation.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { DefaultImageDirective } from '@core/directives/default-image.directive';
import { User } from '@core/models/user.model';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { TranslationService } from '@services/i18n/translation.service';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  closeOutline,
  trashOutline,
  eyeOutline,
  eyeOffOutline,
  cameraOutline,
  cloudUploadOutline
} from 'ionicons/icons';

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
    IonSpinner,
    IonModal,
    TranslatePipe,
    BackButtonComponent,
    UserHeaderComponent,
    DefaultImageDirective
  ]
})
export class ProfilePage implements OnInit {
  readonly mobileNavigation = inject(MobileNavigationService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly fileValidationService = inject(FileValidationService);

  readonly user = signal<User | null>(null);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly showDeleteConfirmation = signal<boolean>(false);
  readonly showDeletePassword = signal<boolean>(false);

  readonly defaultAvatar = DEFAULT_AVATAR;
  readonly avatarPreview = signal<string | null>(null);
  readonly avatarError = signal<string | null>(null);
  readonly isAvatarReading = signal<boolean>(false);
  readonly isUploadingAvatar = signal<boolean>(false);
  readonly isRemovingAvatar = signal<boolean>(false);

  /** The confirmed, stored photo — the pending pick only shows in the confirm modal. */
  readonly avatarSrc = computed(() => this.userService.avatarUrl() ?? DEFAULT_AVATAR);
  readonly hasPendingAvatar = computed(() => this.selectedAvatar() !== null);
  readonly hasStoredAvatar = computed(() => this.user()?.hasAvatar === true);
  readonly isAvatarBusy = computed(() => this.isUploadingAvatar() || this.isRemovingAvatar());

  private readonly selectedAvatar = signal<File | null>(null);

  profileForm: FormGroup;
  deleteAccountForm: FormGroup;

  constructor() {
    addIcons({
      alertCircleOutline,
      closeOutline,
      trashOutline,
      eyeOutline,
      eyeOffOutline,
      cameraOutline,
      cloudUploadOutline
    });
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
    void this.userService.loadAvatar();
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

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Reset the input so re-picking the same file still fires a change event.
    input.value = '';

    if (!file) return;

    this.avatarError.set(null);

    const validation = this.fileValidationService.validateAvatar(file);
    if (!validation.valid) {
      this.avatarError.set(validation.errorKey ?? 'profile.avatar.uploadError');
      return;
    }

    this.isAvatarReading.set(true);
    this.selectedAvatar.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview.set(reader.result as string);
      this.isAvatarReading.set(false);
    };
    reader.onerror = reader.onabort = () => {
      this.clearAvatarSelection();
      this.isAvatarReading.set(false);
      this.avatarError.set('profile.avatar.readError');
    };
    reader.readAsDataURL(file);
  }

  async uploadAvatar(): Promise<void> {
    const file = this.selectedAvatar();
    if (!file || this.isAvatarBusy()) return;

    this.isUploadingAvatar.set(true);
    this.avatarError.set(null);

    try {
      await this.userService.uploadAvatar(file);
      this.clearAvatarSelection();
      this.syncUser();
      this.toastService.show(this.translationService.instant('profile.avatar.uploaded'), 'success');
    } catch {
      this.avatarError.set('profile.avatar.uploadError');
    } finally {
      this.isUploadingAvatar.set(false);
    }
  }

  async removeAvatar(): Promise<void> {
    if (!this.hasStoredAvatar() || this.isAvatarBusy()) return;

    this.isRemovingAvatar.set(true);
    this.avatarError.set(null);

    try {
      await this.userService.deleteAvatar();
      this.clearAvatarSelection();
      this.syncUser();
      this.toastService.show(this.translationService.instant('profile.avatar.removed'), 'success');
    } catch {
      this.avatarError.set('profile.avatar.removeError');
    } finally {
      this.isRemovingAvatar.set(false);
    }
  }

  cancelAvatarSelection(): void {
    if (this.isAvatarBusy()) return;
    this.clearAvatarSelection();
    this.avatarError.set(null);
  }

  private clearAvatarSelection(): void {
    this.selectedAvatar.set(null);
    this.avatarPreview.set(null);
  }

  /** Re-reads the user so `hasAvatar` driven UI reflects the latest state. */
  private syncUser(): void {
    this.user.set(this.userService.getCurrentUser());
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
