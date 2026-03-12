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
import { FormService } from '@services/form.service';
import { ClubService } from '@services/club.service';

@Component({
  selector: 'app-settings-forms',
  templateUrl: './settings-forms.page.html',
  styleUrls: ['./settings-forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, FormHeaderComponent]
})
export class SettingsFormsPage {
  private readonly navigationService = inject(NavigationService);
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);

  readonly forms = signal<FormHeader[]>([]);

  constructor() {
    addIcons({ addOutline, documentTextOutline });
  }

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId !== null) {
      const form = await this.formService.getFormsByClubId(clubId);
      this.forms.set(form);
    }
  }

  addForm(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-forms/new`]);
  }
}
