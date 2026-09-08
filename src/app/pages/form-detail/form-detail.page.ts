import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { FormService } from '@services/form.service';
import { FormSubmissionsService } from '@services/form-submissions.service';
import { FormField } from '@core/models/form-field.model';
import { FormDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
import { BackButtonComponent, FormSubmissionCardComponent, UserHeaderComponent } from '@components/index';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.page.html',
  styleUrls: ['./form-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    TranslatePipe,
    BackButtonComponent,
    UserHeaderComponent,
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

  constructor() {
    addIcons({ documentTextOutline });
  }

  ngOnInit(): void {
    this.formId = Number(this.route.snapshot.paramMap.get('formId'));
  }

  /**
   * Ionic keeps this page alive in the navigation stack, so `ngOnInit` does not run again when the
   * member comes back from submitting. Reloading here is what makes a new submission show up.
   */
  async ionViewWillEnter(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    const [detail, submissions] = await Promise.all([
      this.formService.getFormById(this.formId),
      this.formSubmissionsService.getMySubmissions(this.formId).catch(() => [] as FormSubmission[]),
    ]);

    const sorted = [...detail.fields ?? []].sort((a, b) => a.order - b.order);
    this.formDetail.set(detail);
    this.formFields.set(sorted);
    this.mySubmissions.set(submissions);
    this.loading.set(false);
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
  
  backRoute(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/forms`;
  }

  private navigateToSubmission(submissionId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo(
      [`/app/${roleType}/${roleId}/forms/${this.formId}/${submissionId}`],
      // Tells the form where "back" leads, since it is reachable from the list too.
      { queryParams: { from: 'detail' } }
    );
  }
}
