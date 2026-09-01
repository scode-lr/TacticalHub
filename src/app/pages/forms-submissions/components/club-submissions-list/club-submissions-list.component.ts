import { Component, inject, signal, viewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ClubService } from '@core/services/club.service';
import { FormService } from '@core/services/form.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { FormDetail, SubmissionDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
import { AppStatus } from '@core/models/app-status.model';
import { FieldReviewState } from '@components/submission-detail-view/submission-detail-view.component';
import { SubmissionReviewModalComponent, ReviewResult } from '@components/action-requests/submission-review-modal/submission-review-modal.component';
import { SubmissionsStatCardsComponent } from './submissions-stat-cards/submissions-stat-cards.component';
import { Table, TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, closeOutline, documentTextOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-club-submissions-list',
  templateUrl: './club-submissions-list.component.html',
  styleUrls: ['./club-submissions-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TableModule, TagModule, InputTextModule, IconFieldModule, InputIconModule, PaginatorModule, IonIcon, SubmissionReviewModalComponent, SubmissionsStatCardsComponent]
})
export class ClubSubmissionsListComponent implements OnInit, OnDestroy {
  private readonly clubService = inject(ClubService);
  private readonly formService = inject(FormService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);
  private searchDebounceHandle: ReturnType<typeof setTimeout> | null = null;
  private submissionsRequestId = 0;

  /** Resolves once the `@defer` block below renders it — used to ask it to refresh after a review. */
  private readonly statCards = viewChild(SubmissionsStatCardsComponent);

  readonly AppStatus = AppStatus;

  readonly loading = signal<boolean>(true);
  readonly formsLoading = signal<boolean>(true);
  readonly submissions = signal<FormSubmission[]>([]);
  readonly forms = signal<FormDetail[]>([]);
  readonly skeletonRows = [1, 2, 3];
  readonly skeletonCards = [1, 2, 3, 4];

  readonly pageSize = signal<number>(10);
  readonly currentPage = signal<number>(1);
  readonly totalCount = signal<number>(0);

  /** Empty string means no status filter. */
  readonly statusFilter = signal<string>('');
  selectedFormId: number | '' = '';
  searchValue = '';

  readonly isReviewOpen = signal<boolean>(false);
  readonly selectedSubmission = signal<SubmissionDetail | null>(null);
  readonly isDetailLoading = signal<boolean>(false);
  readonly isReviewing = signal<boolean>(false);

  constructor() {
    addIcons({ searchOutline, closeOutline, documentTextOutline, chevronForwardOutline });
  }

  ngOnInit(): void {
    // Three independent background loads, none awaited and none depending on another:
    // submissions, forms (for the filter) and the dashboard counts (in their own
    // `@defer`red `SubmissionsStatCardsComponent`, which fetches itself). The table's
    // own `[lazyLoadOnInit]="false"` stops PrimeNG from *also* firing `onLazyLoad` on
    // init, which would otherwise double the first submissions request.
    void this.loadForms();
    void this.loadSubmissions();
  }

  ngOnDestroy(): void {
    this.cancelSearchDebounce();
    this.submissionsRequestId++;
  }

  /** Pull-to-refresh: reloads all three independent blocks together, awaited so the gesture's spinner reflects real completion. */
  async refresh(): Promise<void> {
    await Promise.all([this.loadForms(), this.loadSubmissions(), this.statCards()?.reload() ?? Promise.resolve()]);
  }

  async setStatusFilter(status: string): Promise<void> {
    if (this.statusFilter() === status) return;
    this.statusFilter.set(status);
    this.currentPage.set(1);
    await this.loadSubmissions();
  }

  async onFormFilterChange(): Promise<void> {
    this.currentPage.set(1);
    await this.loadSubmissions();
  }

  onSearch(): void {
    this.cancelSearchDebounce();
    this.submissionsRequestId++;
    this.searchDebounceHandle = setTimeout(() => {
      this.searchDebounceHandle = null;
      this.currentPage.set(1);
      void this.loadSubmissions();
    }, 300);
  }

  async clearSearch(dt?: Table): Promise<void> {
    this.cancelSearchDebounce();
    this.searchValue = '';
    dt?.reset();
    this.currentPage.set(1);
    await this.loadSubmissions();
  }

  async onLazyLoad(event: TableLazyLoadEvent): Promise<void> {
    const rows = event.rows ?? this.pageSize();
    const rowsChanged = rows !== this.pageSize();
    this.pageSize.set(rows);
    this.currentPage.set(rowsChanged ? 1 : Math.floor((event.first ?? 0) / rows) + 1);
    await this.loadSubmissions();
  }

  /** Keeps the mobile paginator on the same signal state as the desktop table. */
  async onMobilePage(event: PaginatorState): Promise<void> {
    const rows = event.rows ?? this.pageSize();
    this.pageSize.set(rows);
    this.currentPage.set(Math.floor((event.first ?? 0) / rows) + 1);
    await this.loadSubmissions();
  }

  async openReview(submission: FormSubmission): Promise<void> {
    this.selectedSubmission.set(null);
    this.isReviewOpen.set(true);
    this.isDetailLoading.set(true);
    try {
      this.selectedSubmission.set(await this.formSubmissionsService.getSubmission(submission.id));
    } finally {
      this.isDetailLoading.set(false);
    }
  }

  closeReview(): void {
    this.isReviewOpen.set(false);
    this.selectedSubmission.set(null);
  }

  async handleApprove(result: ReviewResult): Promise<void> {
    await this.review(true, result.comment, result.fieldStates);
  }

  async handleReject(result: ReviewResult): Promise<void> {
    await this.review(false, result.comment, result.fieldStates);
  }

  private async review(approved: boolean, comment: string, fieldStates: Record<number, FieldReviewState>): Promise<void> {
    const submission = this.selectedSubmission();
    if (!submission || this.isReviewing()) return;

    const fieldStatuses: Record<number, string> = {};
    for (const [id, state] of Object.entries(fieldStates)) {
      if (state === 'ok') fieldStatuses[+id] = AppStatus.Approved;
      else if (state === 'nok') fieldStatuses[+id] = AppStatus.Rejected;
    }

    this.isReviewing.set(true);
    try {
      await this.formSubmissionsService.reviewSubmission(submission.id, approved, comment || null, fieldStatuses);
      this.closeReview();
      await this.loadSubmissions();
      // The review just moved a submission out of its old status, so the dashboard counts are
      // stale too — refreshed in the background, sequenced after (not parallel with) the
      // submissions reload above, since nothing here needs to wait on it.
      void this.statCards()?.reload();
    } finally {
      this.isReviewing.set(false);
    }
  }

  getSeverity(status: string): 'success' | 'warn' | 'danger' | undefined {
    switch (status) {
      case AppStatus.Approved: return 'success';
      case AppStatus.Pending: return 'warn';
      case AppStatus.Rejected: return 'danger';
      default: return undefined;
    }
  }

  private async loadForms(): Promise<void> {
    this.formsLoading.set(true);
    try {
      const clubId = this.clubService.getCurrentClubId();
      if (clubId === null) return;
      this.forms.set(await this.formService.getFormsByClubId(clubId, undefined, false, 200, 0));
    } finally {
      this.formsLoading.set(false);
    }
  }

  private async loadSubmissions(): Promise<void> {
    const requestId = ++this.submissionsRequestId;
    this.loading.set(true);
    try {
      const clubId = this.clubService.getCurrentClubId();
      if (clubId === null) return;

      const page = await this.formSubmissionsService.getClubSubmissions(clubId, this.pageSize(), (this.currentPage() - 1) * this.pageSize(), {
        status: this.statusFilter() || undefined,
        formId: this.selectedFormId || undefined,
        search: this.searchValue || undefined
      });

      if (requestId !== this.submissionsRequestId) return;
      this.submissions.set(page.submissions);
      this.totalCount.set(page.totalCount);
    } catch (error) {
      if (requestId !== this.submissionsRequestId) return;
      console.error('Error loading club submissions:', error);
      this.submissions.set([]);
      this.totalCount.set(0);
    } finally {
      if (requestId === this.submissionsRequestId) this.loading.set(false);
    }
  }

  private cancelSearchDebounce(): void {
    if (this.searchDebounceHandle === null) return;
    clearTimeout(this.searchDebounceHandle);
    this.searchDebounceHandle = null;
  }
}
