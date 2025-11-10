import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
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
export class SigninPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);

  readonly signinForm: FormGroup;
  readonly isLoading = this.authService.isLoading;
  readonly showToast = signal<boolean>(false);
  readonly toastMessage = signal<string>('');
  readonly toastColor = signal<string>('success');
  readonly appName = environment.name;
  readonly formSubmitted = signal<boolean>(false);

  readonly tagline = computed(() => 
    this.translationService.instant(environment.taglineKey)
  );

  readonly emailError = computed(() => {
    const control = this.signinForm.get('email');
    if (this.formSubmitted() && control?.errors) {
      if (control.errors['required']) return this.translationService.instant('validation.emailRequired');
      if (control.errors['email']) return this.translationService.instant('validation.emailInvalid');
    }
    return null;
  });

  readonly passwordError = computed(() => {
    const control = this.signinForm.get('password');
    if (this.formSubmitted() && control?.errors) {
      if (control.errors['required']) return this.translationService.instant('validation.passwordRequired');
      if (control.errors['minlength']) return this.translationService.instant('validation.passwordMinLength');
    }
    return null;
  });

  constructor() {
    addIcons({ logoGoogle, logoApple, arrowBack, alertCircle, eyeOutline });
    
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goBack(): void {
    this.router.navigate(['/welcome']);
  }

  async onSignIn(): Promise<void> {
    this.formSubmitted.set(true);
    
    if (!this.signinForm.valid) {
      this.showToastMessage(this.translationService.instant('validation.checkInput'), 'warning');
      return;
    }

    try {
      const email = this.signinForm.value.email;
      const password = this.signinForm.value.password;
      
      const response = await this.authService.signIn({ email, password });
      
      if (response.success) {
        this.router.navigate(['/auth/loading']);
      } else {
        this.showToastMessage(response.message, 'danger');
      }
    } catch (error) {
      this.showToastMessage(this.translationService.instant('messages.signInError'), 'danger');
    }
  }

  onSocialLoginComplete(result: SocialLoginResult): void {
    if (result.success) {
      const messageKey = result.provider === 'google' ? 'messages.googleSignInSuccess' : 'messages.appleSignInSuccess';
      this.showToastMessage(this.translationService.instant(messageKey), 'success');
      
      setTimeout(() => {
        this.router.navigate(['/app/teams-search']);
      }, 800);
    } else {
      const messageKey = result.provider === 'google' ? 'messages.googleSignInFailed' : 'messages.appleSignInFailed';
      this.showToastMessage(this.translationService.instant(messageKey), 'danger');
    }
  }

  navigateToSignUp(): void {
    this.router.navigate(['/signup']);
  }

  continueAsGuest(): void {
    this.router.navigate(['/app/teams-search']);
  }

  private showToastMessage(message: string, color: string = 'success'): void {
    this.toastMessage.set(message);
    this.toastColor.set(color);
    this.showToast.set(true);
  }

  onToastDismiss(): void {
    this.showToast.set(false);
  }
}
