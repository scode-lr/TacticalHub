import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bodyOutline, calendarOutline, checkmarkOutline, chevronForwardOutline, closeOutline, documentTextOutline, peopleOutline } from 'ionicons/icons';
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

  readonly isPending = computed((): boolean =>
    !this.editable() && !this.mySubmissionLoading() && !this.hasSubmission() && this.formOpen()
  );

  readonly isRejected = computed((): boolean => this.mySubmissionStatus() === AppStatus.Rejected);

  constructor() {
    addIcons({ bodyOutline, calendarOutline, checkmarkOutline, chevronForwardOutline, closeOutline, documentTextOutline, peopleOutline });
  }

  redirect(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const route = this.editable() ? 'settings-forms' : 'forms';
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/${route}/${this.form().id}`]);
  }
}
