import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { FormHeader } from '@models/form-header.model';
import { AppStatus } from '@models/app-status.model';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { FormAction } from '@core/models/form-action.enum';
import { SettingsFormFieldsComponent } from './settings-form-fields/settings-form-fields.component';

interface HeaderFormControls {
  name: FormControl<string>;
  description: FormControl<string>;
  fromDate: FormControl<string>;
  toDate: FormControl<string>;
  status: FormControl<AppStatus>;
  action: FormControl<string>;
  fields: FormArray;
}

@Component({
  selector: 'app-settings-form-detail',
  templateUrl: './settings-form-detail.page.html',
  styleUrls: ['./settings-form-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonIcon, TranslatePipe, BackButtonComponent, SettingsFormFieldsComponent]
})
export class SettingsFormDetailPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly fb = inject(FormBuilder);

  readonly isEditMode = signal<boolean>(false);
  readonly formId = signal<string | null>(null);

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'admin.settingsForms.editForm' : 'admin.settingsForms.newForm'
  );

  readonly statusOptions = [
    AppStatus.Active,
    AppStatus.Inactive,
    AppStatus.Pending,
    AppStatus.Draft,
    AppStatus.Archived
  ];

  readonly actionOptions = Object.values(FormAction);

  form!: FormGroup;

  get ctrl(): HeaderFormControls {
    return this.form.controls as unknown as HeaderFormControls;
  }

  constructor() {
    addIcons({ saveOutline });
  }

  ngOnInit(): void {
    const id = this.navigationService.findRouteParam('formId');
    this.isEditMode.set(id !== 'new');
    this.formId.set(id);
    this.buildForm(id !== 'new' ? this.getMockForm(id!) : null);
  }

  get fieldsArray(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  private buildForm(existing: FormHeader | null): void {
    this.form = this.fb.group({
      name: [existing?.name ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [existing?.description ?? '', Validators.maxLength(500)],
      fromDate: [existing ? this.toInputDate(existing.fromDate) : ''],
      toDate: [existing ? this.toInputDate(existing.toDate) : ''],
      status: [existing?.status ?? AppStatus.Draft, Validators.required],
      action: [existing?.action ?? '', Validators.required],
      fields: this.fb.array([])
    });
  }

  private toInputDate(date: Date | null): string {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  }

  private getMockForm(id: string): FormHeader | null {
    const mocks: FormHeader[] = [
      {
        id: 1,
        name: 'Membership Registration 2025',
        description: 'Annual membership registration form for all club members.',
        clubId: 1,
        fromDate: new Date('2025-01-01'),
        toDate: new Date('2025-12-31'),
        status: AppStatus.Active,
        action: FormAction.BecomeMember,
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
        status: AppStatus.Draft,
        action: FormAction.RegisterPlayer,
        settingsJson: {},
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-02-10')
      }
    ];
    return mocks.find(f => f.id === Number(id)) ?? null;
  }
}
