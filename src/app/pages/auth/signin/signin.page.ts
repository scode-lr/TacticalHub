import { Component, OnInit } from '@angular/core';
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
import { logoGoogle, logoApple, arrowBack, alertCircle } from 'ionicons/icons';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';
import { AuthBrandingComponent } from '@components/auth-branding/auth-branding.component';
import { SocialLoginComponent, SocialLoginResult } from '@components/social-login/social-login.component';
import { TranslatePipe } from '@pipes/index';
import { MockAuthService } from '@services/mock-auth.service';

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
export class SigninPage implements OnInit {
  signinForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  appName = environment.name;
  tagline = '';
  formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translationService: TranslationService,
    private mockAuthService: MockAuthService
  ) {
    addIcons({ logoGoogle, logoApple, arrowBack, alertCircle });
    
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.tagline = this.translationService.t(environment.taglineKey);
    this.signinForm.statusChanges.subscribe(status => {
    });
  }

  goBack() {
    this.router.navigate(['/welcome']);
  }

  async onSignIn() {
    this.formSubmitted = true;
    
    if (this.signinForm.valid) {
      this.isLoading = true;
      
      try {
        const email = this.signinForm.value.email;
        const password = this.signinForm.value.password;
        
        // Call mock auth service
        this.mockAuthService.signIn(email, password).subscribe({
          next: (authResponse) => {
            // Save auth data
            this.mockAuthService.saveAuthData(authResponse);
            
            // Navigate to loading page
            this.router.navigate(['/auth/loading']);
          },
          error: (error) => {
            this.isLoading = false;
            this.showToastMessage('Invalid email or password', 'danger');
          }
        });
        
      } catch (error) {
        this.isLoading = false;
        this.showToastMessage('An error occurred', 'danger');
      }
    } else {
      this.showToastMessage('Please check your input', 'warning');
    }
  }

  onSocialLoginComplete(result: SocialLoginResult) {
    if (result.success) {
      const providerName = result.provider === 'google' ? 'Google' : 'Apple';
      this.showToastMessage(`${providerName} sign-in successful!`, 'success');
      
      setTimeout(() => {
        this.router.navigate(['/app/teams-search']);
      }, 800);
    } else {
      const providerName = result.provider === 'google' ? 'Google' : 'Apple';
      this.showToastMessage(`${providerName} sign-in failed`, 'danger');
    }
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  private async simulateAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Authentication failed'));
        }
      }, 1500);
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.signinForm.controls).forEach(key => {
      const control = this.signinForm.get(key);
      control?.markAsTouched();
    });
  }

  private showToastMessage(message: string, color: string = 'success') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  get emailError() {
    const control = this.signinForm.get('email');
    if (this.formSubmitted && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email';
    }
    return null;
  }

  get passwordError() {
    const control = this.signinForm.get('password');
    if (this.formSubmitted && control?.errors) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return null;
  }
}
