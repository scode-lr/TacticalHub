import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormsService } from '@services/forms.service';
import { ClubService } from '@services/club.service';
import { Form, FormStatus } from '@core/models/form.model';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.page.html',
  styleUrls: ['./forms-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner, TranslatePipe]
})
export class FormsListPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly formsService = inject(FormsService);
  private readonly clubService = inject(ClubService);

  readonly forms = signal<Form[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadForms();
  }

  private async loadForms(): Promise<void> {
    const clubId = this.clubService.getStoredClub()?.id ?? this.clubService.getInternalClubId();
    if (!clubId) return;

    this.isLoading.set(true);
    this.error.set(null);
    try {
      const result = await this.formsService.getAvailableForms(clubId);
      this.forms.set(result);
    } catch {
      this.error.set('forms.errors.loadError');
    } finally {
      this.isLoading.set(false);
    }
  }

  openForm(formId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms`, formId.toString()]);
  }

  isActive(form: Form): boolean {
    return form.status === FormStatus.Active;
  }
}
