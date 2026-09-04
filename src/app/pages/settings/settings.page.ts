import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonSelect, IonSelectOption, IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, alertCircle, checkmarkCircle } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { MobileNavigationService } from '@services/mobile-navigation.service';
import { AuthService } from '@services/auth.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { PasswordStrengthComponent } from '@components/password-strength/password-strength.component';
import { environment } from '@environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonInput,
    IonSpinner,
    TranslatePipe,
    BackButtonComponent,
    UserHeaderComponent,
    PasswordStrengthComponent,
  ]
})
export class SettingsPage implements OnInit {
  private readonly translationService = inject(TranslationService);
  readonly mobileNavigation = inject(MobileNavigationService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  readonly appVersion = environment.version;

  readonly currentLanguage = signal<string>('en');
  readonly supportedLanguages = signal<Array<{ code: string; name: string }>>([]);
  readonly isLoading = this.authService.isLoading;

  readonly passwordForm: FormGroup;
  readonly passwordFormSubmitted = signal(false);
  readonly passwordFeedback = signal<{ success: boolean; message: string } | null>(null);
  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);

  // Live value for the password-strength meter — presentation only, the
  // reactive form validators below remain the source of truth.
  readonly passwordValue = signal<string>('');

  readonly currentPasswordError = computed(() => {
    const control = this.passwordForm.get('currentPassword');
    if (this.passwordFormSubmitted() && control?.errors) {
      if (control.errors['required']) return this.translationService.instant('validation.passwordRequired');
    }
    return null;
  });

  readonly newPasswordError = computed(() => {
    const control = this.passwordForm.get('newPassword');
    if (this.passwordFormSubmitted() && control?.errors) {
      if (control.errors['required']) return this.translationService.instant('validation.passwordRequired');
      if (control.errors['minlength']) return this.translationService.instant('validation.passwordMinLength');
    }
    return null;
  });

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline, alertCircle, checkmarkCircle });
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.currentLanguage.set(this.translationService.getCurrentLanguage());
    this.loadSupportedLanguages();
  }

  loadSupportedLanguages() {
    const languages = this.translationService.getSupportedLanguages();
    const languageNames: Record<string, string> = {
      'en': 'settings.english',
      'es': 'settings.spanish',
      'ca': 'settings.catalan'
    };
    this.supportedLanguages.set(
      languages.map(code => ({ code, name: languageNames[code] || code }))
    );
  }

  onLanguageChange(event: any) {
    const newLanguage = event.detail.value;
    this.translationService.setLanguage(newLanguage, true);
    this.currentLanguage.set(newLanguage);
  }

  async changePassword(): Promise<void> {
    this.passwordFormSubmitted.set(true);
    this.passwordFeedback.set(null);
    if (!this.passwordForm.valid) return;

    const result = await this.authService.updatePassword({
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
    });

    this.passwordFeedback.set({ success: result.success, message: result.message });
    if (result.success) {
      this.passwordForm.reset();
      this.passwordFormSubmitted.set(false);
      this.passwordValue.set('');
    }
  }

  onPasswordInput(event: any): void {
    this.passwordValue.set(event.target.value ?? '');
  }

  toggleCurrentPassword(): void { this.showCurrentPassword.update(v => !v); }
  toggleNewPassword(): void { this.showNewPassword.update(v => !v); }
}
