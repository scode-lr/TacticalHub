import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { NavigationService } from '@services/navigation.service';
import { SubmissionDetail } from '@core/responses/form.response';
import { SubmissionValue } from '@core/models/submission-value.model';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-forms-submission-detail',
  templateUrl: './forms-submission-detail.page.html',
  styleUrls: ['./forms-submission-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, BackButtonComponent, CheckboxModule]
})
export class FormsSubmissionDetailPage implements OnInit {
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private readonly navigationService = inject(NavigationService);

  readonly submission = signal<SubmissionDetail | null>(null);
  readonly loading = signal<boolean>(true);

  async ngOnInit(): Promise<void> {
    const submissionId = Number(this.navigationService.findRouteParam('idSubmision'));
    if (!submissionId) return;
    try {
      const result = await this.formSubmissionsService.getSubmission(submissionId);
      this.submission.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  getDisplayValue(value: SubmissionValue): string {
    if (value.valueText !== null) return value.valueText;
    if (value.valueNumber !== null) return String(value.valueNumber);
    if (value.valueDate !== null) return value.valueDate;
    return '—';
  }
}
