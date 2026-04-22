import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonIcon, IonSpinner, IonInput, IonModal, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormsService } from '@services/forms.service';
import { ClubService } from '@services/club.service';
import { SnackbarService } from '@services/snackbar.service';
import { Form, FormAction } from '@core/models/form.model';
import { CreateFormRequest } from '@core/requests/form.request';
import { AppStatus } from '@core/models/app-status.model';

@Component({
  selector: 'app-admin-forms-list',
  templateUrl: './admin-forms-list.page.html',
  styleUrls: ['./admin-forms-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonSpinner,
    IonInput,
    IonModal,
    IonSelect,
    IonSelectOption,
    TranslatePipe
  ]
})
export class AdminFormsListPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly formsService = inject(FormsService);
  private readonly clubService = inject(ClubService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  readonly forms = signal<Form[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isCreating = signal<boolean>(false);
  readonly showCreateModal = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly FormStatus = AppStatus;
  readonly FormAction = FormAction;

  readonly createForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    fromDate: [''],
    toDate: [''],
    action: [FormAction.None, Validators.required]
  });

  readonly formActions = Object.values(FormAction);

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

  openCreateModal(): void {
    this.createForm.reset({ action: FormAction.None });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  async onCreateForm(): Promise<void> {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);
    try {
      const values = this.createForm.value;
      const request: CreateFormRequest = {
        name: values.name!,
        description: values.description ?? undefined,
        fromDate: values.fromDate ?? undefined,
        toDate: values.toDate ?? undefined,
        action: (values.action as FormAction) ?? FormAction.None
      };
      const created = await this.formsService.createForm(request);
      if (created) {
        this.forms.update(list => [created, ...list]);
        this.closeCreateModal();
        this.snackbarService.show('forms.admin.createSuccess', 'success');
      }
    } catch {
      this.snackbarService.show('forms.errors.createError', 'danger');
    } finally {
      this.isCreating.set(false);
    }
  }

  openFormDetail(formId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/forms`, formId.toString()]);
  }

  isActive(form: Form): boolean {
    return form.status === AppStatus.Active;
  }
}
