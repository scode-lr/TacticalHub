import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircle, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { TranslationService } from '@services/i18n/translation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthBrandingComponent } from '../components';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
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
export class ForgotPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);

  readonly isLoading = this.authService.isLoading;
  readonly formSubmitted = signal(false);
  readonly sent = signal(false);
  readonly forgotForm: FormGroup;
  sentEmail = '';

  readonly emailError = computed(() => {
    const control = this.forgotForm.get('email');
    if (this.formSubmitted() && control?.errors) {
      if (control.errors['required']) return this.translationService.instant('validation.emailRequired');
      if (control.errors['email']) return this.translationService.instant('validation.emailInvalid');
    }
    return null;
  });

  constructor() {
    addIcons({ alertCircle, mailOutline, lockClosedOutline });
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted.set(true);
    if (!this.forgotForm.valid) return;
    this.sentEmail = this.forgotForm.value.email;
    const result = await this.authService.forgotPassword({ email: this.sentEmail });
    if (result.success) {
      this.sent.set(true);
    } else {
      this.toastService.show(result.message, 'danger');
    }
  }

  goToSignIn(): void {
    this.navigationService.navigateTo(['auth/signin']);
  }
}
