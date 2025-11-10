import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonButton,
  IonIcon,
  IonInput,
  IonText,
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logoApple, arrowBack, alertCircle, eyeOutline } from 'ionicons/icons';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';
import { AuthBrandingComponent } from '@components/auth-branding/auth-branding.component';
import { SocialLoginComponent, SocialLoginResult } from '@components/social-login/social-login.component';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon,
    IonInput,
    IonText,
    IonSpinner,
    IonToast,
    AuthBrandingComponent,
    SocialLoginComponent,
    TranslatePipe
  ]
})
export class SignupPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);

  readonly signupForm: FormGroup;
  readonly isLoading = this.authService.isLoading;
  readonly showToast = signal<boolean>(false);
  readonly toastMessage = signal<string>('');
  readonly appName = environment.name;
  readonly formSubmitted = signal<boolean>(false);

  constructor() {
    addIcons({ logoGoogle, logoApple, arrowBack, alertCircle, eyeOutline });
    
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  goBack(): void {
    this.router.navigate(['/welcome']);
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  async onSignUp(): Promise<void> {
    this.formSubmitted.set(true);
    
    if (!this.signupForm.valid) {
      this.showToastMessage(this.translationService.instant('validation.fillAllFields'));
      return;
    }

    try {
      const formData = this.signupForm.value;
      
      const response = await this.authService.signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      if (response.success) {
        this.showToastMessage(this.translationService.instant('messages.accountCreatedSuccess'));
        setTimeout(() => {
          this.router.navigate(['/auth/loading']);
        }, 1000);
      } else {
        this.showToastMessage(response.message);
      }
    } catch (error) {
      this.showToastMessage(this.translationService.instant('messages.signUpError'));
    }
  }

  onSocialLoginComplete(result: SocialLoginResult): void {
    if (result.success) {
      const messageKey = result.provider === 'google' ? 'messages.googleSignUpSuccess' : 'messages.appleSignUpSuccess';
      this.showToastMessage(this.translationService.instant(messageKey));
      
      setTimeout(() => {
        this.router.navigate(['/app/teams-search']);
      }, 800);
    } else {
      const messageKey = result.provider === 'google' ? 'messages.googleSignUpFailed' : 'messages.appleSignUpFailed';
      this.showToastMessage(this.translationService.instant(messageKey));
    }
  }

  navigateToSignIn(): void {
    this.router.navigate(['/signin']);
  }

  continueAsGuest(): void {
    this.router.navigate(['/app/teams-search']);
  }

  private showToastMessage(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
  }

  onToastDismiss(): void {
    this.showToast.set(false);
  }

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
}
