import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { FormService } from '@core/services/form.service';
import { ClubService } from '@core/services/club.service';
import { NotificationsService } from '@core/services/notifications.service';
import { NavigationService } from '@services/navigation.service';
import { FormDetail } from '@core/responses/form.response';
import { AppStatus } from '@core/models/app-status.model';
import { FormAction } from '@core/models/form-action.enum';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, documentTextOutline, closeOutline, chevronForwardOutline, chevronBackOutline, bodyOutline, peopleOutline } from 'ionicons/icons';
import { ActionRequestsComponent } from '@components/action-requests/action-requests.component';

@Component({
  selector: 'app-forms-submissions',
  templateUrl: './forms-submissions.page.html',
  styleUrls: ['./forms-submissions.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TableModule, TagModule, InputTextModule, IconFieldModule, InputIconModule, IonIcon, ActionRequestsComponent]
})
export class FormsSubmissionsPage implements OnInit {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly navigationService = inject(NavigationService);

  constructor() {
    addIcons({ searchOutline, documentTextOutline, closeOutline, chevronForwardOutline, chevronBackOutline, bodyOutline, peopleOutline });
  }

  readonly forms = signal<FormDetail[]>([]);
  readonly loading = signal<boolean>(true);
  readonly formsLimit = signal<number>(10);
  readonly formsOffset = signal<number>(0);
  readonly hasMoreForms = signal<boolean>(false);

  readonly ActiveStatus = AppStatus.Active;

  searchValue = '';

  readonly formsPageNumber = computed(() => Math.floor(this.formsOffset() / this.formsLimit()) + 1);

  async ngOnInit(): Promise<void> {
    // The pending-approval block still reads from the notifications feed; the definitive
    // data source (dedicated endpoint vs. /notifications) is still to be decided.
    if (this.notificationsService.getNotifications().length === 0) {
      void this.notificationsService.loadNotifications();
    }

    await this.loadForms();
  }

  visibleForms(): FormDetail[] {
    const query = this.searchValue.trim().toLocaleLowerCase();
    if (!query) return this.forms();

    return this.forms().filter(form =>
      [form.name, form.action, form.status]
        .some(value => String(value ?? '').toLocaleLowerCase().includes(query))
    );
  }

  async prevFormsPage(): Promise<void> {
    if (this.formsOffset() === 0) return;
    this.formsOffset.set(Math.max(0, this.formsOffset() - this.formsLimit()));
    await this.loadForms();
  }

  async nextFormsPage(): Promise<void> {
    if (!this.hasMoreForms()) return;
    this.formsOffset.set(this.formsOffset() + this.formsLimit());
    await this.loadForms();
  }

  private async loadForms(): Promise<void> {
    this.loading.set(true);
    try {
      const clubId = this.clubService.getCurrentClubId();
      if (clubId !== null) {
        const limit = this.formsLimit();
        // GET /forms returns no total, so one extra row is requested just to
        // find out whether there is a next page.
        const result = await this.formService.getFormsByClubId(clubId, undefined, true, limit + 1, this.formsOffset());
        this.hasMoreForms.set(result.length > limit);
        this.forms.set(result.slice(0, limit));
      }
    } catch (error) {
      console.error(error);
      this.forms.set([]);
      this.hasMoreForms.set(false);
    } finally {
      this.loading.set(false);
    }
  }

  selectForm(formId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms-submissions/${formId}`]);
  }

  clear(): void {
    this.searchValue = '';
  }

  formIcon(form: FormDetail): string {
    switch (form.action) {
      case FormAction.RegisterPlayer: return 'body-outline';
      case FormAction.BecomeMember:   return 'people-outline';
      default:                        return 'document-text-outline';
    }
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case AppStatus.Active: return 'success';
      case AppStatus.Pending: return 'warn';
      case AppStatus.Draft: return 'info';
      case AppStatus.Inactive: return 'danger';
      default: return undefined;
    }
  }
}
