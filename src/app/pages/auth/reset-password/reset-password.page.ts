import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, alertCircle, eyeOutline, eyeOffOutline, checkmarkCircleOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { TranslationService } from '@services/i18n/translation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthBrandingComponent } from '../components';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonInput,
    IonSpinner,
    TranslatePipe,
    AuthBrandingComponent,
  ]
})
export class ResetPasswordPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = this.authService.isLoading;
  readonly formSubmitted = signal(false);
  readonly done = signal(false);
  readonly showPassword = signal(false);
  readonly resetForm: FormGroup;
  token = '';
  successMessage = '';

  readonly passwordError = computed(() => {
    const control = this.resetForm.get('newPassword');
    if (this.formSubmitted() && control?.errors) {
      if (control.errors['required']) return this.translationService.instant('validation.passwordRequired');
      if (control.errors['minlength']) return this.translationService.instant('validation.passwordMinLength');
    }
    return null;
  });

  readonly strengthLevel = computed(() => {
    const val: string = this.resetForm.get('newPassword')?.value ?? '';
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
    addIcons({ arrowBack, alertCircle, eyeOutline, eyeOffOutline, checkmarkCircleOutline, lockClosedOutline });
    this.resetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted.set(true);
    if (!this.resetForm.valid) return;
    if (!this.token) {
      return;
    }
    const result = await this.authService.resetPassword({
      token: this.token,
      newPassword: this.resetForm.value.newPassword,
    });
    this.successMessage = result.message;
    this.done.set(result.success);
    if (result.success) {
      setTimeout(() => this.navigationService.navigateTo(['auth/signin']), 2500);
    }
  }

  goToSignIn(): void {
    this.navigationService.navigateTo(['auth/signin']);
  }
}
