import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { AppStatus as Status } from '@models/app-status.model';
import { FormHeader } from '@models/form-header.model';
import { FormHeaderComponent } from './form-header/form-header.component';
import { addIcons } from 'ionicons';
import { addOutline, documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings-forms',
  templateUrl: './settings-forms.page.html',
  styleUrls: ['./settings-forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, FormHeaderComponent]
})
export class SettingsFormsPage {
  private readonly navigationService = inject(NavigationService);

  readonly forms = signal<FormHeader[]>([
    {
      id: 1,
      name: 'Membership Registration 2025',
      description: 'Annual membership registration form for all club members.',
      clubId: 1,
      fromDate: new Date('2025-01-01'),
      toDate: new Date('2025-12-31'),
      status: Status.Active,
      action: 'registration',
      settingsJson: {},
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 2,
      name: 'Season Enrollment Form',
      description: 'Player enrollment form for the upcoming season.',
      clubId: 1,
      fromDate: new Date('2025-06-01'),
      toDate: new Date('2025-08-31'),
      status: Status.Draft,
      action: 'enrollment',
      settingsJson: {},
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-10')
    }
  ]);

  constructor() {
    addIcons({ addOutline, documentTextOutline });
  }

  addForm(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-forms/new`]);
  }
}
