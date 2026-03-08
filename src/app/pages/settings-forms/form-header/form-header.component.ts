import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormHeader } from '@models/form-header.model';
import { addIcons } from 'ionicons';
import { calendarOutline, flashOutline, settingsOutline, pencilOutline } from 'ionicons/icons';
import { NavigationService } from '@core/index';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class FormHeaderComponent {
  private readonly navigationService = inject(NavigationService);

  readonly form = input.required<FormHeader>();
  readonly index = input<number>(0);
  readonly editable = input<boolean>(true);

  constructor() {
    addIcons({ calendarOutline, flashOutline, settingsOutline, pencilOutline });
  }

  onEdit(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/settings-forms/${this.form().id}`]);
  }

  onAnswer(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms/${this.form().id}`]);
  }
}
