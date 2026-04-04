import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, chevronForwardOutline, flashOutline, settingsOutline } from 'ionicons/icons';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormHeader } from '@models/form-header.model';
import { AppStatus } from '@models/app-status.model';
import { NavigationService } from '@core/index';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, Tag, Button, Chip]
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
      case AppStatus.Archived: return 'secondary';
      default:                 return 'secondary';
    }
  });

  constructor() {
    addIcons({ flashOutline, calendarOutline, settingsOutline, chevronForwardOutline });
  }

  redirect(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const route = this.editable() ? 'settings-forms' : 'forms';
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/${route}/${this.form().id}`]);
  }
}
