import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { 
  IonButton,
  IonIcon,
  IonInput,
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logoApple, arrowBack, alertCircle, eyeOutline } from 'ionicons/icons';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { AuthBrandingComponent, AuthFooterComponent } from '../components';
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
    IonSpinner,
    IonToast,
    AuthBrandingComponent,
    AuthFooterComponent,
    TranslatePipe
  ]
})
export class SignupPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly navigationService = inject(NavigationService);
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
      birthDate: ['', [Validators.required, this.dateValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  goBack(): void {
    this.navigationService.navigateTo(['/auth/welcome']);
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(dateRegex);
    
    if (!match) {
      return { invalidDate: true };
    }

    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) {
      return { invalidDate: true };
    }

    if (dayNum < 1 || dayNum > 31) {
      return { invalidDate: true };
    }

    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
      return { invalidDate: true };
    }

    if (date > new Date()) {
      return { futureDate: true };
    }

    return null;
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
      
      let birthDateString: string | undefined;
      if (formData.birthDate) {
        const [day, month, year] = formData.birthDate.split('/');
        birthDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      const response = await this.authService.signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        birthDate: birthDateString,
        password: formData.password
      });
      
      console.log('SignUp Response:', response);
      
      if (response.success) {
        this.showToastMessage(this.translationService.instant('messages.accountCreatedSuccess'));
        setTimeout(() => {
          this.navigationService.navigateTo(['/auth/loading']);
        }, 1000);
      } else {
        this.showToastMessage(response.message);
      }
    } catch (error) {
      this.showToastMessage(this.translationService.instant('messages.signUpError'));
    }
  }

  private showToastMessage(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
  }

  onToastDismiss(): void {
    this.showToast.set(false);
  }

  onDateInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    
    this.signupForm.patchValue({ birthDate: value }, { emitEvent: false });
    event.target.value = value;
  }

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
}
