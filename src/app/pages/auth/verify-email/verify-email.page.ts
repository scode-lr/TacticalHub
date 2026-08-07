import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircle, arrowBack, mailOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { ToastService } from '@services/toast.service';
import { AuthBrandingComponent } from '../components';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonInput,
    IonSpinner,
    TranslatePipe,
    AuthBrandingComponent,
  ],
})
export class VerifyEmailPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = this.authService.isLoading;
  readonly formSubmitted = signal(false);
  readonly email = signal('');
  readonly verificationForm: FormGroup;

  readonly codeInvalid = computed(() =>
    this.formSubmitted() && this.verificationForm.get('code')?.invalid
  );

  constructor() {
    addIcons({ alertCircle, arrowBack, mailOutline });
    this.verificationForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    this.email.set(this.route.snapshot.queryParamMap.get('email')?.trim() ?? '');
    if (!this.email()) {
      this.navigationService.navigateTo(['auth/signin']);
    }
  }

  normalizeCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    const code = (input.value ?? '').replace(/\D/g, '').slice(0, 6);
    this.verificationForm.patchValue({ code }, { emitEvent: false });
    input.value = code;
  }

  async verify(): Promise<void> {
    this.formSubmitted.set(true);
    if (this.verificationForm.invalid || !this.email()) return;

    const result = await this.authService.verifyEmail({
      email: this.email(),
      code: this.verificationForm.value.code,
    });

    if (result.success) {
      await this.navigationService.navigateTo(['auth/loading']);
      return;
    }

    this.toastService.show(result.message, 'danger');
  }

  async resend(): Promise<void> {
    if (!this.email()) return;
    const result = await this.authService.resendEmailVerification(this.email());
    this.toastService.show(result.message, result.success ? 'success' : 'danger');
  }

  goToSignIn(): void {
    this.navigationService.navigateTo(['auth/signin']);
  }
}
