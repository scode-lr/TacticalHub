import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bodyOutline, calendarOutline, chevronForwardOutline, documentTextOutline, flashOutline, peopleOutline, settingsOutline } from 'ionicons/icons';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormHeader } from '@models/form-header.model';
import { AppStatus } from '@models/app-status.model';
import { FormAction } from '@models/form-action.enum';
import { NavigationService } from '@core/index';
import { Tag } from 'primeng/tag';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, Tag, Chip]
})
export class FormHeaderComponent {
  private readonly navigationService = inject(NavigationService);

  readonly form = input.required<FormHeader>();
  readonly index = input<number>(0);
  readonly editable = input<boolean>(true);

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

  constructor() {
    addIcons({ flashOutline, calendarOutline, settingsOutline, chevronForwardOutline, documentTextOutline, bodyOutline, peopleOutline });
  }

  redirect(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const route = this.editable() ? 'settings-forms' : 'forms';
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/${route}/${this.form().id}`]);
  }
}
