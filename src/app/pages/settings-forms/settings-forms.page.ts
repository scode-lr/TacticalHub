import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormHeader } from '@models/form-header.model';
import { FormAction } from '@models/form-action.enum';
import { FormHeaderComponent } from './form-header/form-header.component';
import { FormTypePickerComponent } from './components/form-type-picker/form-type-picker.component';
import { FormsGroupSectionComponent } from '@components/forms-group-section/forms-group-section.component';
import { addIcons } from 'ionicons';
import { addOutline, documentTextOutline, bodyOutline, peopleOutline } from 'ionicons/icons';
import { FormService } from '@services/form.service';
import { ClubService } from '@services/club.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';

interface FormGroup {
  action: FormAction;
  icon: string;
  titleKey: string;
  forms: FormHeader[];
}

@Component({
  selector: 'app-settings-forms',
  templateUrl: './settings-forms.page.html',
  styleUrls: ['./settings-forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, FormHeaderComponent, BackButtonComponent, FormTypePickerComponent, FormsGroupSectionComponent]
})
export class SettingsFormsPage {
  private readonly navigationService = inject(NavigationService);
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);

  readonly forms = signal<FormHeader[]>([]);
  readonly loading = signal<boolean>(true);
  readonly isTypePickerOpen = signal<boolean>(false);

  readonly formGroups = computed<FormGroup[]>(() => {
    const all = this.forms();
    const groups: FormGroup[] = [
      { action: FormAction.RegisterPlayer, icon: 'body-outline', titleKey: 'admin.settingsForms.groups.registerPlayer', forms: [] },
      { action: FormAction.BecomeMember, icon: 'people-outline', titleKey: 'admin.settingsForms.groups.becomeMember', forms: [] },
      { action: FormAction.Simple, icon: 'document-text-outline', titleKey: 'admin.settingsForms.groups.general', forms: [] }
    ];
    for (const form of all) {
      groups.find(group => group.action === form.action)?.forms.push(form);
    }
    return groups.filter(group => group.forms.length > 0);
  });

  constructor() {
    addIcons({ addOutline, documentTextOutline, bodyOutline, peopleOutline });
  }

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId !== null) {
      const result = await this.formService.getFormsByClubId(clubId);
      this.forms.set(result);
    }
    this.loading.set(false);
  }

  addForm(): void {
    this.isTypePickerOpen.set(true);
  }

  closeTypePicker(): void {
    this.isTypePickerOpen.set(false);
  }

  selectType(action: FormAction): void {
    this.isTypePickerOpen.set(false);
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-forms/new`], { queryParams: { action } });
  }
}
