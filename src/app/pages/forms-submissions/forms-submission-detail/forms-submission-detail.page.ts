import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { SubmissionDetailViewComponent, FieldReviewState } from '@components/submission-detail-view/submission-detail-view.component';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { NavigationService } from '@services/navigation.service';
import { SubmissionDetail } from '@core/responses/form.response';
import { AppStatus } from '@core/models/app-status.model';
import { IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forms-submission-detail',
  templateUrl: './forms-submission-detail.page.html',
  styleUrls: ['./forms-submission-detail.page.scss'],
  standalone: true,
  imports: [FormsModule, TranslatePipe, BackButtonComponent, SubmissionDetailViewComponent, IonToast, UserHeaderComponent]
})
export class FormsSubmissionDetailPage implements OnInit {
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);

  readonly AppStatus = AppStatus;

  readonly submission = signal<SubmissionDetail | null>(null);
  readonly loading = signal<boolean>(true);
  readonly isReviewing = signal<boolean>(false);
  readonly fieldStates = signal<Record<number, FieldReviewState>>({});

  readonly toastVisible = signal<boolean>(false);
  readonly toastMessage = signal<string>('');
  readonly toastColor = signal<'success' | 'danger'>('danger');

  comment = '';

  async ngOnInit(): Promise<void> {
    const submissionId = Number(this.navigationService.findRouteParam('submissionId'));
    if (!submissionId) return;
    try {
      const result = await this.formSubmissionsService.getSubmission(submissionId);
      this.submission.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  backRoute(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/forms-submissions`;
  }

  onFieldStatesChange(states: Record<number, FieldReviewState>): void {
    this.fieldStates.set(states);
  }

  async approve(): Promise<void> {
    await this.review(true);
  }

  async reject(): Promise<void> {
    await this.review(false);
  }

  private async review(approved: boolean): Promise<void> {
    const submission = this.submission();
    if (!submission || this.isReviewing()) return;

    const fieldStatuses: Record<number, string> = {};
    for (const [id, state] of Object.entries(this.fieldStates())) {
      if (state === 'ok') fieldStatuses[+id] = AppStatus.Approved;
      else if (state === 'nok') fieldStatuses[+id] = AppStatus.Rejected;
    }

    this.isReviewing.set(true);
    try {
      await this.formSubmissionsService.reviewSubmission(submission.id, approved, this.comment || null, fieldStatuses);
      const refreshed = await this.formSubmissionsService.getSubmission(submission.id);
      this.submission.set(refreshed);
      this.comment = '';
      this.fieldStates.set({});
    } catch (error) {
      console.error('Error reviewing submission:', error);
      this.showToast(this.translationService.instant('admin.forms.submissionDetail.reviewError'), 'danger');
    } finally {
      this.isReviewing.set(false);
    }
  }

  private showToast(message: string, color: 'success' | 'danger' = 'danger'): void {
    this.toastMessage.set(message);
    this.toastColor.set(color);
    this.toastVisible.set(true);
  }

  onToastDismiss(): void {
    this.toastVisible.set(false);
  }
}
