import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { FormService } from '@services/form.service';
import { ClubService } from '@services/club.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { FormHeader } from '@models/form-header.model';
import { FormSubmission } from '@models/form-submission.model';
import { FormAction } from '@models/form-action.enum';
import { FormHeaderComponent } from '../settings-forms/form-header/form-header.component';
import { FormsGroupSectionComponent } from '@components/forms-group-section/forms-group-section.component';
import { PullToRefreshComponent } from '@components/pull-to-refresh/pull-to-refresh.component';
import { addIcons } from 'ionicons';
import { documentTextOutline, bodyOutline, peopleOutline } from 'ionicons/icons';
import { AppStatus } from '@core/models';

interface MemberFormRow {
  form: FormHeader;
  isOpen: boolean;
  mySubmissionStatus: string | null;
  mySubmissionLoading: boolean;
}

interface MemberFormGroup {
  action: FormAction;
  icon: string;
  titleKey: string;
  rows: MemberFormRow[];
}

@Component({
  selector: 'app-member-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, FormHeaderComponent, FormsGroupSectionComponent, PullToRefreshComponent]
})
export class FormsPage {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly formSubmissionsService = inject(FormSubmissionsService);

  readonly rows = signal<MemberFormRow[]>([]);
  readonly loading = signal<boolean>(true);

  readonly formGroups = computed<MemberFormGroup[]>(() => {
    const groups: MemberFormGroup[] = [
      { action: FormAction.RegisterPlayer, icon: 'body-outline', titleKey: 'admin.settingsForms.groups.registerPlayer', rows: [] },
      { action: FormAction.BecomeMember, icon: 'people-outline', titleKey: 'admin.settingsForms.groups.becomeMember', rows: [] },
      { action: FormAction.Simple, icon: 'document-text-outline', titleKey: 'admin.settingsForms.groups.general', rows: [] }
    ];
    for (const row of this.rows()) {
      groups.find(group => group.action === row.form.action)?.rows.push(row);
    }
    return groups.filter(group => group.rows.length > 0);
  });

  constructor() {
    addIcons({ documentTextOutline, bodyOutline, peopleOutline });
  }

  /**
   * Ionic keeps this page alive in the navigation stack, so `ngOnInit` would not run again when the
   * member returns from filling a form — leaving every row showing its pre-submission status.
   */
  async ionViewWillEnter(): Promise<void> {
    await this.load();
  }

  async onRefresh(complete: () => void): Promise<void> {
    await this.load();
    complete();
  }

  private async load(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId === null) {
      this.loading.set(false);
      return;
    }

    const forms = await this.formService.getFormsByClubId(clubId, AppStatus.Active);
    this.rows.set(forms.map(form => ({
      form,
      isOpen: this.computeIsOpen(form),
      mySubmissionStatus: null,
      mySubmissionLoading: true
    })));
    this.loading.set(false);

    // Kept off the initial load: the list renders as soon as the forms
    // themselves arrive, and the whole batch resolves in one request instead
    // of the page waiting on every form's own my-submissions call.
    void this.loadMySubmissionStatuses(clubId);
  }

  private async loadMySubmissionStatuses(clubId: number): Promise<void> {
    let submissionsByFormId: Record<number, FormSubmission> = {};
    try {
      submissionsByFormId = await this.formSubmissionsService.getMySubmissionsByClub(clubId);
    } catch {
      submissionsByFormId = {};
    }
    this.rows.update(rows => rows.map(row => ({
      ...row,
      mySubmissionStatus: submissionsByFormId[row.form.id]?.status ?? null,
      mySubmissionLoading: false
    })));
  }

  private computeIsOpen(form: FormHeader): boolean {
    const now = new Date();
    if (form.fromDate && now < new Date(form.fromDate)) return false;
    if (form.toDate && now > new Date(form.toDate)) return false;
    return true;
  }
}
