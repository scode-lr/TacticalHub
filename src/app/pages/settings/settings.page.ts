import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSelect, IonSelectOption, IonContent, IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, alertCircle, checkmarkCircle } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { AuthService } from '@services/auth.service';
import { UserHeaderComponent } from '@components/user-header/user-header.component';

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
    UserHeaderComponent,
  ]
})
export class SettingsPage implements OnInit {
  private readonly translationService = inject(TranslationService);
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  readonly currentLanguage = signal<string>('en');
  readonly supportedLanguages = signal<Array<{ code: string; name: string }>>([]);
  readonly isLoading = this.authService.isLoading;

  readonly passwordForm: FormGroup;
  readonly passwordFormSubmitted = signal(false);
  readonly passwordFeedback = signal<{ success: boolean; message: string } | null>(null);
  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);

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

  readonly strengthLevel = computed(() => {
    const val: string = this.passwordForm.get('newPassword')?.value ?? '';
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  });

  readonly strengthLabel = computed(() => {
    const keys = ['', 'auth.strengthWeak', 'auth.strengthFair', 'auth.strengthGood', 'auth.strengthStrong'];
    const key = keys[this.strengthLevel()];
    return key ? this.translationService.instant(key) : '';
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
    }
  }

  toggleCurrentPassword(): void { this.showCurrentPassword.update(v => !v); }
  toggleNewPassword(): void { this.showNewPassword.update(v => !v); }

  goBack() {
    this.navigationService.goBack();
  }
}
