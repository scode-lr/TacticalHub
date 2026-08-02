import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircle, eyeOutline, eyeOffOutline, checkmarkCircleOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { TranslationService } from '@services/i18n/translation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthBrandingComponent } from '../components';
import { PasswordStrengthComponent } from '@components/password-strength/password-strength.component';
import { ToastService } from '@services/toast.service';

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
    PasswordStrengthComponent,
  ]
})
export class ResetPasswordPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  readonly isLoading = this.authService.isLoading;
  readonly formSubmitted = signal(false);
  readonly done = signal(false);
  readonly showPassword = signal(false);
  readonly resetForm: FormGroup;
  token = '';
  successMessage = '';

  // Live value for the password-strength meter — presentation only, the
  // reactive form validators below remain the source of truth.
  readonly passwordValue = signal<string>('');

  readonly passwordError = computed(() => {
    const control = this.resetForm.get('newPassword');
    if (this.formSubmitted() && control?.errors) {
      if (control.errors['required']) return this.translationService.instant('validation.passwordRequired');
      if (control.errors['minlength']) return this.translationService.instant('validation.passwordMinLength');
    }
    return null;
  });

  constructor() {
    addIcons({ alertCircle, eyeOutline, eyeOffOutline, checkmarkCircleOutline, lockClosedOutline });
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

  onPasswordInput(event: any): void {
    this.passwordValue.set(event.target.value ?? '');
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
    } else {
      this.toastService.show(result.message, 'danger');
    }
  }

  goToSignIn(): void {
    this.navigationService.navigateTo(['auth/signin']);
  }
}
