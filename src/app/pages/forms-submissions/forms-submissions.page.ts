import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { FormService } from '@core/services/form.service';
import { ClubService } from '@core/services/club.service';
import { NavigationService } from '@core/services/navigation.service';
import { FormDetail } from '@core/responses/form.response';
import { AppStatus } from '@core/models/app-status.model';
import { FormAction } from '@core/models/form-action.enum';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-forms-submissions',
  templateUrl: './forms-submissions.page.html',
  styleUrls: ['./forms-submissions.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TableModule, TagModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule]
})
export class FormsSubmissionsPage {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);

  readonly forms = signal<FormDetail[]>([]);
  readonly loading = signal<boolean>(true);

  selectedForms: FormDetail[] = [];
  searchValue = '';

  get statuses() {
    return [
      { label: this.translationService.instant('admin.settingsForms.status.AC'), value: AppStatus.Active },
      { label: this.translationService.instant('admin.settingsForms.status.I'), value: AppStatus.Inactive },
      { label: this.translationService.instant('admin.settingsForms.status.P'), value: AppStatus.Pending },
      { label: this.translationService.instant('admin.settingsForms.status.D'), value: AppStatus.Draft },
      { label: this.translationService.instant('admin.settingsForms.status.AR'), value: AppStatus.Archived },
    ];
  }

  get actions() {
    return [
      { label: this.translationService.instant('admin.settingsForms.actions.simple'), value: FormAction.Simple },
      { label: this.translationService.instant('admin.settingsForms.actions.register-player'), value: FormAction.RegisterPlayer },
      { label: this.translationService.instant('admin.settingsForms.actions.become-member'), value: FormAction.BecomeMember },
    ];
  }

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId !== null) {
      const data = await this.formService.getFormsByClubId(clubId, undefined, true);
      this.forms.set(data);
    }
    this.loading.set(false);
  }

  navigateToForm(formId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms-submissions/${formId}`]);
  }

  clear(dt: Table): void {
    this.searchValue = '';
    dt.reset();
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case AppStatus.Active: return 'success';
      case AppStatus.Pending: return 'warn';
      case AppStatus.Draft: return 'info';
      case AppStatus.Inactive: return 'danger';
      case AppStatus.Archived: return 'secondary';
      default: return undefined;
    }
  }

  getActionSeverity(action: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (action) {
      case FormAction.Simple: return 'info';
      case FormAction.RegisterPlayer: return 'success';
      case FormAction.BecomeMember: return 'warn';
      default: return undefined;
    }
  }
}
