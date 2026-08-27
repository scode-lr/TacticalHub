import { Component, signal, viewChild } from '@angular/core';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ClubSubmissionsListComponent } from './components/club-submissions-list/club-submissions-list.component';
import { FormsSyncListComponent } from './components/forms-sync-list/forms-sync-list.component';
import { PullToRefreshComponent } from '@components/pull-to-refresh/pull-to-refresh.component';

type FormsSubmissionsTab = 'submissions' | 'sync';

@Component({
  selector: 'app-forms-submissions',
  templateUrl: './forms-submissions.page.html',
  styleUrls: ['./forms-submissions.page.scss'],
  standalone: true,
  imports: [TranslatePipe, ClubSubmissionsListComponent, FormsSyncListComponent, PullToRefreshComponent]
})
export class FormsSubmissionsPage {
  private readonly submissionsList = viewChild(ClubSubmissionsListComponent);
  private readonly syncList = viewChild(FormsSyncListComponent);

  readonly activeTab = signal<FormsSubmissionsTab>('submissions');

  /**
   * Whether the "sync" tab has ever been opened. Both tabs stay mounted (hidden via CSS, not
   * `@if`/`@else`) once visited, so switching between them never re-triggers `ngOnInit` and its
   * API calls — each tab loads its data once and keeps it until an explicit action (review,
   * sync) refreshes it. `sync` still only mounts on first visit, so opening the page doesn't
   * eagerly fetch a tab the admin hasn't looked at yet.
   */
  readonly visitedSync = signal<boolean>(false);

  setTab(tab: FormsSubmissionsTab): void {
    this.activeTab.set(tab);
    if (tab === 'sync') this.visitedSync.set(true);
  }

  /** Pull-to-refresh: only the currently visible tab reloads — the hidden one keeps its data until it's shown again. */
  async onRefresh(complete: () => void): Promise<void> {
    const active = this.activeTab() === 'submissions' ? this.submissionsList() : this.syncList();
    await active?.refresh();
    complete();
  }
}
