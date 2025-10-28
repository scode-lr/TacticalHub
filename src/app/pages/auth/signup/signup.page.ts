import { Component } from '@angular/core';
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
    AuthBrandingComponent
  ]
})
export class SignupPage {
  signupForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  appName = environment.name;
  formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translationService: TranslationService
  ) {
    addIcons({ logoGoogle, logoApple, arrowBack, alertCircle });
    
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

  goBack() {
    this.router.navigate(['/welcome']);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  async onSignUp() {
    this.formSubmitted = true;
    
    if (this.signupForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.isLoading = false;
        this.showToastMessage('Account created successfully!');
        
        setTimeout(() => {
          this.router.navigate(['/app/teams-search']);
        }, 1000);
      }, 2000);
    } else {
      this.showToastMessage('Please fill in all required fields correctly.');
    }
  }

  async signUpWithGoogle() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.showToastMessage('Google Sign-Up not implemented yet');
    }, 1000);
  }

  async signUpWithApple() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.showToastMessage('Apple Sign-Up not implemented yet');
    }, 1000);
  }

  navigateToSignIn() {
    this.router.navigate(['/signin']);
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
}
