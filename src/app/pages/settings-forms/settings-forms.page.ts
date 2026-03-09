import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { AppStatus as Status } from '@models/app-status.model';
import { FormHeader } from '@models/form-header.model';
import { FormAction } from '@models/form-action.enum';
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
      name: 'Hacerse socio',
      description: 'Formulario para que los interesados puedan solicitar hacerse socios del club.',
      clubId: 1,
      fromDate: null,
      toDate: null,
      status: Status.Active,
      action: FormAction.BecomeMember,
      settingsJson: {},
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 2,
      name: 'Formulario de inscripción de temporada',
      description: 'Formulario de inscripción de jugadores para la próxima temporada.',
      clubId: 1,
      fromDate: new Date('2025-06-01'),
      toDate: new Date('2025-08-31'),
      status: Status.Draft,
      action: FormAction.RegisterPlayer,
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
