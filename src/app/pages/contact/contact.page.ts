import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { ClubService } from '@services/club.service';
import { ContactMessageService } from '@services/contact-message.service';
import { ToastService } from '@services/toast.service';
import { NavigationService } from '@services/navigation.service';
import { ContactMessageType } from '@core/models/contact-message.model';
import { TranslationService } from '@core/services/i18n/translation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonIcon, IonSpinner, TranslatePipe]
})
export class ContactPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly clubService = inject(ClubService);
  private readonly contactMessageService = inject(ContactMessageService);
  private readonly toastService = inject(ToastService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly requestType = signal<ContactMessageType>('general');

  readonly titleKey = computed(() => this.requestType() === 'sponsor' ? 'contact.sponsorTitle' : 'contact.title');
  readonly subtitleKey = computed(() => this.requestType() === 'sponsor' ? 'contact.sponsorSubtitle' : 'contact.subtitle');

  readonly form = this.fb.nonNullable.group({
    contactName: ['', [Validators.required, Validators.maxLength(200)]],
    contactEmail: ['', [Validators.email, Validators.maxLength(320)]],
    contactPhone: ['', [Validators.maxLength(50)]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
  });

  ngOnInit(): void {
    const queryType = this.route.snapshot.queryParamMap.get('type');
    this.requestType.set(queryType === 'sponsor' ? 'sponsor' : 'general');
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const clubId = this.clubService.getCurrentClubId() ?? 0;
    if (!clubId) return;

    this.submitting.set(true);
    try {
      const value = this.form.getRawValue();
      await this.contactMessageService.create(clubId, {
        type: this.requestType(),
        subject: value.subject,
        message: value.message,
        contactName: value.contactName,
        contactEmail: value.contactEmail || null,
        contactPhone: value.contactPhone || null
      });
      this.submitted.set(true);
      this.toastService.show(this.translationService.instant('contact.sent'), 'success');
      this.form.reset();
    } catch {
      this.toastService.show(this.translationService.instant('contact.error'), 'danger');
    } finally {
      this.submitting.set(false);
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.invalid && control?.touched);
  }
}
