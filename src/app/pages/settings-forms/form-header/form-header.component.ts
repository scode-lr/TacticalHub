import { Component, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bodyOutline, calendarOutline, checkmarkOutline, chevronForwardOutline, closeOutline, copyOutline, documentTextOutline, ellipsisVertical, peopleOutline, timeOutline, trashOutline } from 'ionicons/icons';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormHeader } from '@models/form-header.model';
import { AppStatus } from '@models/app-status.model';
import { FormAction } from '@models/form-action.enum';
import { NavigationService } from '@core/index';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, Tag]
})
export class FormHeaderComponent {
  private readonly navigationService = inject(NavigationService);

  readonly form = input.required<FormHeader>();
  readonly index = input<number>(0);
  readonly editable = input<boolean>(true);

  /** Member list only: whether the submission window is currently open. */
  readonly formOpen = input<boolean>(true);
  /** Member list only: status of the current user's latest submission, if any (fetched separately per row). */
  readonly mySubmissionStatus = input<string | null>(null);
  /** Member list only: true while mySubmissionStatus is still being fetched for this row. */
  readonly mySubmissionLoading = input<boolean>(false);

  /** Admin rows only: true while this row's duplicate request is in flight. */
  readonly duplicating = input<boolean>(false);
  /** Admin rows only: true while this row's remove request is in flight. */
  readonly removing = input<boolean>(false);

  readonly duplicate = output<FormHeader>();
  readonly remove = output<FormHeader>();

  readonly menuOpen = signal<boolean>(false);

  readonly statusSeverity = computed((): 'success' | 'info' | 'warn' | 'secondary' => {
    switch (this.form().status) {
      case AppStatus.Active:   return 'success';
      case AppStatus.Pending:  return 'info';
      case AppStatus.Draft:    return 'warn';
      case AppStatus.Inactive: return 'secondary';
      default:                 return 'secondary';
    }
  });

  readonly formIcon = computed((): string => {
    switch (this.form().action) {
      case FormAction.RegisterPlayer: return 'body-outline';
      case FormAction.BecomeMember:   return 'people-outline';
      case FormAction.Simple:
      default:                        return 'document-text-outline';
    }
  });

  /** Admin rows dim on inactive status; member rows dim once the submission window has closed. */
  readonly isDim = computed((): boolean =>
    this.editable() ? this.form().status !== AppStatus.Active : !this.formOpen()
  );

  readonly hasSubmission = computed((): boolean => this.mySubmissionStatus() !== null);

  /** Nothing sent yet and the window is open: the form is still waiting on the member. */
  readonly isPending = computed((): boolean =>
    !this.editable() && !this.mySubmissionLoading() && !this.hasSubmission() && this.formOpen()
  );

  readonly isRejected = computed((): boolean => this.mySubmissionStatus() === AppStatus.Rejected);

  /**
   * Sent, but coordination has not resolved it yet.
   *
   * Kept apart from approved on purpose: showing the same tick for both told the member their
   * request was settled when it was still in the queue.
   */
  readonly isUnderReview = computed((): boolean => {
    const status = this.mySubmissionStatus();
    return status === AppStatus.Pending || status === AppStatus.Submitted;
  });

  readonly submissionIcon = computed((): string => {
    if (this.isRejected()) return 'close-outline';
    if (this.isUnderReview()) return 'time-outline';
    return 'checkmark-outline';
  });

  readonly submissionLabelKey = computed((): string => {
    if (this.isRejected()) return 'user.forms.submission.statusRejected';
    if (this.isUnderReview()) return 'user.forms.submission.statusUnderReview';
    return 'user.forms.submission.statusApproved';
  });

  constructor() {
    addIcons({ bodyOutline, calendarOutline, checkmarkOutline, chevronForwardOutline, closeOutline, copyOutline, documentTextOutline, ellipsisVertical, peopleOutline, timeOutline, trashOutline });
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update(open => !open);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) return;
    if (!(event.target as HTMLElement).closest('.fr-actions')) {
      this.menuOpen.set(false);
    }
  }

  /** Kept out of `redirect()` so the row click still opens the builder. */
  onDuplicateClick(event: Event): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    if (this.duplicating()) return;
    this.duplicate.emit(this.form());
  }

  onRemoveClick(event: Event): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    if (this.removing()) return;
    this.remove.emit(this.form());
  }

  /**
   * Admin rows always open the builder. Member rows open the submission list, except when the row
   * already tells us there is nothing to list: then the form itself is the destination, so the
   * member does not pass through an empty page on the way in.
   */
  redirect(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();

    if (this.editable()) {
      this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-forms/${this.form().id}`]);
      return;
    }

    const base = `/app/${roleType}/${roleId}/forms/${this.form().id}`;

    // While the status is still loading we do not know yet; the list page handles the empty case.
    const goStraightToForm = !this.mySubmissionLoading() && !this.hasSubmission() && this.formOpen();

    this.navigationService.navigateTo([goStraightToForm ? `${base}/-1` : base]);
  }
}
