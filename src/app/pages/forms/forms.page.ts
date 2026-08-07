import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { FormService } from '@services/form.service';
import { ClubService } from '@services/club.service';
import { FormSubmissionsService } from '@core/services/form-submissions.service';
import { FormHeader } from '@models/form-header.model';
import { FormAction } from '@models/form-action.enum';
import { FormHeaderComponent } from '../settings-forms/form-header/form-header.component';
import { FormsGroupSectionComponent } from '@components/forms-group-section/forms-group-section.component';
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
  imports: [CommonModule, IonIcon, TranslatePipe, FormHeaderComponent, FormsGroupSectionComponent]
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

  async ngOnInit(): Promise<void> {
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
    // themselves arrive, and each row resolves its own submission status
    // independently (shown as a skeleton meanwhile) instead of the whole
    // page waiting on every my-submissions call.
    forms.forEach(form => void this.loadMySubmissionStatus(form.id));
  }

  private async loadMySubmissionStatus(formId: number): Promise<void> {
    let status: string | null = null;
    try {
      const submissions = await this.formSubmissionsService.getMySubmissions(formId);
      status = submissions[0]?.status ?? null;
    } catch {
      status = null;
    }
    this.rows.update(rows => rows.map(row =>
      row.form.id === formId ? { ...row, mySubmissionStatus: status, mySubmissionLoading: false } : row
    ));
  }

  private computeIsOpen(form: FormHeader): boolean {
    const now = new Date();
    if (form.fromDate && now < new Date(form.fromDate)) return false;
    if (form.toDate && now > new Date(form.toDate)) return false;
    return true;
  }
}
