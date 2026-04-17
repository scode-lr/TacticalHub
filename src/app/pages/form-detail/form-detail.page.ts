import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { FormService } from '@services/form.service';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { FormField } from '@core/models/form-field.model';
import { FormDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
import { BackButtonComponent, FormSubmissionCardComponent } from '@components/index';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.page.html',
  styleUrls: ['./form-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    BackButtonComponent,
    FormSubmissionCardComponent,
  ]
})
export class FormDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly formService = inject(FormService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);

  private formId = 0;

  readonly formDetail = signal<FormDetail | null>(null);
  readonly formFields = signal<FormField[]>([]);
  readonly mySubmissions = signal<FormSubmission[]>([]);
  readonly loading = signal<boolean>(true);

  readonly hasSubmissions = computed(() => this.mySubmissions().length > 0);

  async ngOnInit(): Promise<void> {
    const formId = this.route.snapshot.paramMap.get('formId');
    this.formId = Number(formId);

    const [detail, submissions] = await Promise.all([
      this.formService.getFormById(this.formId),
      this.formSubmissionsService.getMySubmissions(this.formId).catch(() => [] as FormSubmission[]),
    ]);

    const sorted = [...detail.fields ?? []].sort((a, b) => a.order - b.order);
    this.formDetail.set(detail);
    this.formFields.set(sorted);
    this.mySubmissions.set(submissions);
    this.loading.set(false);

    if (!this.hasSubmissions()) {
      this.navigateToSubmission(-1);
    }
  }

  onFillAgain(): void {
    this.navigateToSubmission(-1);
  }

  onEditRejected(submission: FormSubmission): void {
    this.navigateToSubmission(submission.id);
  }

  pageTitle(): string {
    return this.formDetail()?.name ?? '';
  }

  private navigateToSubmission(submissionId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms/${this.formId}/${submissionId}`]);
  }
}
