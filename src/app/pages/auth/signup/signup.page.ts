import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IonIcon,
  IonInput,
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircle } from 'ionicons/icons';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { ToastService } from '@services/toast.service';
import { AuthBrandingComponent, AuthFooterComponent } from '../components';
import { PasswordStrengthComponent } from '@components/password-strength/password-strength.component';
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
    IonIcon,
    IonInput,
    IonSpinner,
    IonToast,
    AuthBrandingComponent,
    AuthFooterComponent,
    PasswordStrengthComponent,
    TranslatePipe
  ]
})
export class SignupPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly signupForm: FormGroup;
  readonly isLoading = this.authService.isLoading;
  readonly showToast = this.toastService.showToast;
  readonly toastMessage = this.toastService.toastMessage;
  readonly appName = environment.name;
  readonly formSubmitted = signal<boolean>(false);

  // Live values for the password-strength meter / confirm-match hint —
  // presentation only, the reactive form validators remain the source of truth.
  readonly passwordValue = signal<string>('');
  readonly confirmValue = signal<string>('');
  readonly passwordsMatch = computed(() => this.passwordValue() === this.confirmValue());

  constructor() {
    addIcons({ alertCircle });

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

    const today = new Date();
    let age = today.getFullYear() - yearNum;
    const birthdayHasPassed = today.getMonth() > monthNum - 1 ||
      (today.getMonth() === monthNum - 1 && today.getDate() >= dayNum);

    if (!birthdayHasPassed) {
      age--;
    }

    if (age < 14) {
      return { minimumAge: true };
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
      this.toastService.show(this.translationService.instant('validation.fillAllFields'));
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
      
      if (response.success) {
        this.toastService.show(this.translationService.instant('messages.accountCreatedSuccess'));
        await this.navigationService.navigateTo(['/auth/verify-email'], {
          queryParams: { email: response.email ?? formData.email }
        });
      } else {
        this.toastService.show(response.message);
      }
    } catch (error) {
      this.toastService.show(this.translationService.instant('messages.signUpError'));
    }
  }

  onToastDismiss(): void {
    this.toastService.hide();
  }

  onPasswordInput(event: any): void {
    this.passwordValue.set(event.target.value ?? '');
  }

  onConfirmInput(event: any): void {
    this.confirmValue.set(event.target.value ?? '');
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
