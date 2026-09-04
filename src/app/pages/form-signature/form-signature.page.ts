import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonModal, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, closeOutline, eyeOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { FormSignatureDraftService } from '@services/form-signature-draft.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { SignaturePadComponent } from '@components/signature-pad/signature-pad.component';
import { FormField } from '@core/models/form-field.model';
import { FormFieldType, isDisplayOnlyField } from '@core/models/form.model';

interface AnswerRow {
  label: string;
  value: string;
  accepted: boolean | null;
}

/**
 * Final step for forms that require a signature: review every answer, then sign and send.
 */
@Component({
  selector: 'app-form-signature',
  templateUrl: './form-signature.page.html',
  styleUrls: ['./form-signature.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, TranslatePipe, BackButtonComponent, SignaturePadComponent, UserHeaderComponent],
})
export class FormSignaturePage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly toastController = inject(ToastController);
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly draftService = inject(FormSignatureDraftService);

  readonly draft = this.draftService.draft;
  readonly signatureDataUrl = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly isReviewOpen = signal<boolean>(false);

  readonly canSubmit = computed(() => !!this.signatureDataUrl() && !this.isSubmitting());

  readonly answers = computed<AnswerRow[]>(() => {
    const draft = this.draft();
    if (!draft) return [];

    return draft.fields
      .filter(field => !isDisplayOnlyField(field.type))
      .map(field => this.toAnswerRow(field, draft.values[field.key]));
  });

  readonly answeredCount = computed(() => this.answers().length);

  constructor() {
    addIcons({ chevronForwardOutline, closeOutline, eyeOutline });
  }

  ngOnInit(): void {
    // Nothing to sign (typically a page reload): send the user back to fill the form again.
    if (!this.draft()) {
      this.navigationService.navigateTo([this.formsRoute()]);
    }
  }

  onSignatureChange(dataUrl: string | null): void {
    this.signatureDataUrl.set(dataUrl);
  }

  goBackToForm(): void {
    const draft = this.draft();
    if (!draft) {
      this.navigationService.navigateTo([this.formsRoute()]);
      return;
    }

    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo(
      [`/app/${roleType}/${roleId}/forms/${draft.formId}/${draft.submissionId}`],
      // Carried through so the form keeps the way out the member arrived by.
      { queryParams: { from: draft.from } }
    );
  }

  backRoute(): string {
    const draft = this.draft();
    if (!draft) return this.formsRoute();

    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/forms/${draft.formId}/${draft.submissionId}`;
  }

  async signAndSubmit(): Promise<void> {
    const draft = this.draft();
    const signature = this.signatureDataUrl();
    if (!draft || !signature || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    try {
      const isEditing = draft.submissionId > 0;

      const payload = { values: draft.values, signature: { dataUrl: signature } };

      if (isEditing) {
        await this.formSubmissionsService.resubmitForm(draft.submissionId, payload);
      } else {
        await this.formSubmissionsService.submitForm(draft.formId, payload);
      }

      this.draftService.clear();
      // replaceUrl drops this signature page (and the filled-in form before it) from history,
      // so there is nothing stale to land back on from the confirmation screen.
      this.navigationService.navigateTo(['/forms/signed'], { replaceUrl: true });
    } catch {
      await this.showToast('user.action.form.errors.submitError', 'danger', 'alert-circle-outline');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private toAnswerRow(field: FormField, raw: unknown): AnswerRow {
    const empty = this.translationService.instant('user.forms.signature.notProvided');

    if (field.type === FormFieldType.Checkbox && typeof raw === 'boolean') {
      return { label: field.label, value: field.label, accepted: raw };
    }

    if (raw === null || raw === undefined || raw === '') {
      return { label: field.label, value: empty, accepted: null };
    }

    if (Array.isArray(raw)) {
      return { label: field.label, value: raw.join(', '), accepted: null };
    }

    return { label: field.label, value: String(raw), accepted: null };
  }

  private formsRoute(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/forms`;
  }

  private async showToast(messageKey: string, color: string, icon: string): Promise<void> {
    const toast = await this.toastController.create({
      message: this.translationService.instant(messageKey),
      duration: 3000,
      position: 'top',
      color,
      icon,
    });
    await toast.present();
  }
}
