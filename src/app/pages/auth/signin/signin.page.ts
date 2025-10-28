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
    AuthBrandingComponent
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
    private translationService: TranslationService
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
        await this.simulateAuth();
        
        this.showToastMessage('Welcome back!', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/teams-search']);
        }, 800);
        
      } catch (error) {
        this.showToastMessage('Invalid email or password', 'danger');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.showToastMessage('Please check your input', 'warning');
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    
    try {
      await this.simulateAuth();
      this.showToastMessage('Google sign-in successful!', 'success');
      
      setTimeout(() => {
        this.router.navigate(['/app/teams-search']);
      }, 800);
      
    } catch (error) {
      this.showToastMessage('Google sign-in failed', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithApple() {
    this.isLoading = true;
    
    try {
      await this.simulateAuth();
      this.showToastMessage('Apple sign-in successful!', 'success');
      
      setTimeout(() => {
        this.router.navigate(['/app/teams-search']);
      }, 800);
      
    } catch (error) {
      this.showToastMessage('Apple sign-in failed', 'danger');
    } finally {
      this.isLoading = false;
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
