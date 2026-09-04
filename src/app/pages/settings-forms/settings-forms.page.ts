import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonToast } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormHeader } from '@models/form-header.model';
import { FormAction } from '@models/form-action.enum';
import { AppStatus } from '@models/app-status.model';
import { FormHeaderComponent } from './form-header/form-header.component';
import { FormTypePickerComponent } from './components/form-type-picker/form-type-picker.component';
import { FormsGroupSectionComponent } from '@components/forms-group-section/forms-group-section.component';
import { addIcons } from 'ionicons';
import { addOutline, documentTextOutline, personAddOutline, cardOutline } from 'ionicons/icons';
import { FormService } from '@services/form.service';
import { ClubService } from '@services/club.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { ToastService } from '@services/toast.service';
import { TranslationService } from '@services/i18n/translation.service';
import { ConfirmService } from '@services/confirm.service';
import { CreateFormRequest, UpdateFormRequest } from '@core/requests/form.request';
import { FormDetail } from '@core/responses/form.response';

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
  imports: [CommonModule, IonIcon, IonToast, TranslatePipe, FormHeaderComponent, BackButtonComponent, FormTypePickerComponent, FormsGroupSectionComponent, UserHeaderComponent]
})
export class SettingsFormsPage {
  private readonly navigationService = inject(NavigationService);
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly confirmService = inject(ConfirmService);

  readonly forms = signal<FormHeader[]>([]);
  readonly loading = signal<boolean>(true);
  readonly isTypePickerOpen = signal<boolean>(false);
  readonly duplicatingId = signal<number | null>(null);
  readonly removingId = signal<number | null>(null);

  readonly showToast = this.toastService.showToast;
  readonly toastMessage = this.toastService.toastMessage;
  readonly toastColor = this.toastService.toastColor;

  readonly formGroups = computed<FormGroup[]>(() => {
    const all = this.forms();
    const groups: FormGroup[] = [
      { action: FormAction.RegisterPlayer, icon: 'person-add-outline', titleKey: 'admin.settingsForms.groups.registerPlayer', forms: [] },
      { action: FormAction.BecomeMember, icon: 'card-outline', titleKey: 'admin.settingsForms.groups.becomeMember', forms: [] },
      { action: FormAction.Simple, icon: 'document-text-outline', titleKey: 'admin.settingsForms.groups.general', forms: [] }
    ];
    for (const form of all) {
      groups.find(group => group.action === form.action)?.forms.push(form);
    }
    return groups.filter(group => group.forms.length > 0);
  });

  constructor() {
    addIcons({ addOutline, documentTextOutline, personAddOutline, cardOutline });
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

  onToastDismiss(): void {
    this.toastService.hide();
  }

  /**
   * Clones settings and fields into a new draft form. Submissions live on the original only:
   * the API never copies them, so the duplicate starts empty by construction.
   */
  async duplicateForm(source: FormHeader): Promise<void> {
    if (this.duplicatingId() !== null) return;

    const clubId = this.clubService.getCurrentClubId();
    if (clubId === null) return;

    this.duplicatingId.set(source.id);
    try {
      const detail = await this.formService.getFormById(source.id);
      const request: CreateFormRequest = {
        clubId,
        ...this.buildFormPayload(detail, AppStatus.Draft),
        name: this.translationService.instant('admin.settingsForms.duplicateName', { name: detail.name })
      };

      const created = await this.formService.createForm(request);
      this.forms.update(list => [...list, created]);
      this.toastService.show(this.translationService.instant('admin.settingsForms.duplicateSuccess'));
    } catch {
      this.toastService.show(this.translationService.instant('admin.settingsForms.duplicateError'), 'danger');
    } finally {
      this.duplicatingId.set(null);
    }
  }

  /**
   * "Delete" never issues a hard DELETE: it moves the form to AppStatus.Archived, a status with
   * no entry point back in the UI (not in the status picker, not in this list's query). That
   * keeps history/fields around for data integrity while making the form permanently invisible
   * and unreachable to admins, which is what the product wants in place of real deletion.
   */
  async removeForm(target: FormHeader): Promise<void> {
    if (this.removingId() !== null) return;

    const confirmed = await this.confirmService.request({
      header: this.translationService.instant('admin.settingsForms.removeConfirmTitle'),
      message: this.translationService.instant('admin.settingsForms.removeConfirmMessage', { name: target.name }),
      confirmText: this.translationService.instant('admin.settingsForms.remove'),
      cancelText: this.translationService.instant('common.cancel')
    });
    if (!confirmed) return;

    this.removingId.set(target.id);
    try {
      const detail = await this.formService.getFormById(target.id);
      const request: UpdateFormRequest = this.buildFormPayload(detail, AppStatus.Archived);

      await this.formService.updateForm(target.id, request);
      this.forms.update(list => list.filter(form => form.id !== target.id));
      this.toastService.show(this.translationService.instant('admin.settingsForms.removeSuccess'));
    } catch {
      this.toastService.show(this.translationService.instant('admin.settingsForms.removeError'), 'danger');
    } finally {
      this.removingId.set(null);
    }
  }

  private buildFormPayload(detail: FormDetail, status: AppStatus): Required<Pick<CreateFormRequest,
    'name' | 'description' | 'fromDate' | 'toDate' | 'status' | 'action' |
    'requiresSignature' | 'requiresReview' | 'adultsOnly' | 'generatesDocument' | 'fields'>> {
    return {
      name: detail.name,
      description: detail.description || null,
      fromDate: detail.fromDate ? new Date(detail.fromDate).toISOString() : null,
      toDate: detail.toDate ? new Date(detail.toDate).toISOString() : null,
      status,
      action: detail.action,
      requiresSignature: detail.requiresSignature,
      requiresReview: detail.requiresReview,
      adultsOnly: detail.adultsOnly,
      generatesDocument: detail.generatesDocument,
      fields: (detail.fields ?? []).map((f, index) => ({
        key: f.key,
        label: f.label,
        description: f.description,
        type: f.type,
        isRequired: f.isRequired,
        maxLength: f.maxLength,
        order: index + 1,
        options: f.options,
        validationJson: f.validationJson as Record<string, unknown> | null
      }))
    };
  }
}
