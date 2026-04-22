import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonAvatar, IonImg, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { UserService } from '@services/user.service';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { User } from '@core/models/user.model';

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
    IonAvatar,
    IonImg,
    IonIcon,
    TranslatePipe,
    UserHeaderComponent
  ]
})
export class ProfilePage {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  readonly user = signal<User | null>(null);
  readonly avatarUrl = signal<string>('assets/default-avatar.svg');
  readonly isSaving = signal<boolean>(false);
  
  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.avatarUrl.set(currentUser.avatarUrl || 'assets/default-avatar.svg');
      this.patchFormValues(currentUser);
    }
  }

  patchFormValues(user: User) {
    this.profileForm.patchValue({
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    });
  }

  onAvatarError() {
    this.avatarUrl.set('assets/default-avatar.svg');
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
      username: this.profileForm.value.username,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName
    };

    this.userService.setUser(updatedUser);
    this.user.set(updatedUser);

    setTimeout(() => {
      this.isSaving.set(false);
    }, 500);
  }

  goBack() {
    this.navigationService.goBack();
  }
}
