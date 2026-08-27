import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ClubService } from '@core/services/club.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { SubmissionStatusCounts } from '@core/responses/form.response';
import { AppStatus } from '@core/models/app-status.model';

const EMPTY_COUNTS: SubmissionStatusCounts = { pending: 0, approved: 0, rejected: 0, total: 0 };

/**
 * Owns its own counts fetch — instantiated behind an `@defer` block in the parent so the
 * dashboard loads on its own timeline, independently of the submissions list and the form
 * filter. Exposes `reload()` for the parent to call after an action changes the counts (e.g.
 * approving/rejecting a submission).
 */
@Component({
  selector: 'app-submissions-stat-cards',
  templateUrl: './submissions-stat-cards.component.html',
  styleUrls: ['./submissions-stat-cards.component.scss'],
  standalone: true,
  imports: [TranslatePipe]
})
export class SubmissionsStatCardsComponent implements OnInit {
  private readonly clubService = inject(ClubService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);

  readonly AppStatus = AppStatus;

  /** Which status the parent's list is currently filtered to (`''` means "Tots"). */
  readonly activeStatus = input<string>('');
  readonly statusSelected = output<string>();

  readonly loading = signal<boolean>(true);
  readonly counts = signal<SubmissionStatusCounts>(EMPTY_COUNTS);

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    try {
      const clubId = this.clubService.getCurrentClubId();
      if (clubId === null) return;
      this.counts.set(await this.formSubmissionsService.getClubSubmissionCounts(clubId));
    } catch (error) {
      console.error('Error loading submission counts:', error);
      this.counts.set(EMPTY_COUNTS);
    } finally {
      this.loading.set(false);
    }
  }
}
