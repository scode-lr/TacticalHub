import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormHeader } from '@core/models/form-header.model';
import { FormService } from '@core/services/form.service';
import { ClubService } from '@core/services/club.service';
import { NavigationService } from '@core/services/navigation.service';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  documentTextOutline,
  flashOutline,
  downloadOutline,
  personAddOutline,
  checkboxOutline
} from 'ionicons/icons';
import { FormDetail } from '@core/responses/form.response';


@Component({
  selector: 'app-forms-submissions',
  templateUrl: './forms-submissions.page.html',
  styleUrls: ['./forms-submissions.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class FormsSubmissionsPage {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly navigationService = inject(NavigationService);

  readonly forms = signal<FormDetail[]>([]);
  readonly loading = signal<boolean>(true);
  readonly selectedIds = signal<Set<number>>(new Set());

  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly hasSelection = computed(() => this.selectedCount() > 0);
  readonly allSelected = computed(
    () => this.forms().length > 0 && this.selectedIds().size === this.forms().length
  );

  constructor() {
    addIcons({
      chevronForwardOutline,
      documentTextOutline,
      flashOutline,
      downloadOutline,
      personAddOutline,
      checkboxOutline
    });
  }

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId !== null) {
        const data = await this.formService.getFormsByClubId(clubId, undefined, true);
      this.forms.set(data);
    }
    this.loading.set(false);
  }

  toggleSelect(id: number, event: Event): void {
    event.stopPropagation();
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
  }

  toggleAll(event: Event): void {
    event.stopPropagation();
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.forms().map(f => f.id)));
    }
  }

  navigateToForm(formId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms-submissions/${formId}`]);
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }
}
