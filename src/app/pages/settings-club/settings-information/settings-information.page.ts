import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IonIcon, IonToast } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { ToastService } from '@services/toast.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { IconPickerModalComponent } from '@components/modals/icon-picker-modal/icon-picker-modal.component';
import { PreviewModalComponent } from '@components/modals/preview-modal/preview-modal.component';
import { SectionFooterActionsComponent } from '@components/section-footer-actions/section-footer-actions.component';
import { SectionDisplayComponent, SectionDisplayData } from '@components/section-display/section-display.component';
import { ClubInformationService } from '@services/club-information.service';
import { ClubService } from '@services/club.service';
import { ClubInformation, CreateClubInformationRequest, UpdateClubInformationRequest } from '@core/models/club-information.model';
import { addIcons } from 'ionicons';
import {
  addOutline, eyeOutline, closeOutline, createOutline, saveOutline,
  chevronUpOutline, chevronDownOutline, trashOutline,
  chevronDown, informationCircleOutline
} from 'ionicons/icons';

interface SectionFormValue {
  id: number | null;
  title: string;
  content: string;
  icon: string;
  sortOrder: number;
}

@Component({
  selector: 'app-settings-information',
  templateUrl: './settings-information.page.html',
  styleUrls: ['./settings-information.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonToast,
    TranslatePipe,
    BackButtonComponent,
    IconPickerModalComponent,
    PreviewModalComponent,
    SectionFooterActionsComponent,
    SectionDisplayComponent,
  ]
})
export class SettingsInformationPage implements OnInit {
  private readonly clubInformationService = inject(ClubInformationService);
  private readonly clubService = inject(ClubService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly fb = inject(FormBuilder);

  // --- State ---
  readonly loading = signal(true);
  readonly isSaving = signal(false);
  readonly previewOpen = signal(false);
  readonly expandedIndex = signal<number | null>(null);
  readonly isIconPickerOpen = signal(false);
  readonly iconPickerTargetIndex = signal<number | null>(null);

  readonly showToast = this.toastService.showToast;
  readonly toastMessage = this.toastService.toastMessage;
  readonly toastColor = this.toastService.toastColor;

  // --- Form ---
  form!: FormGroup;
  private originalSections: ClubInformation[] = [];
  private clubId: number | null = null;

  get sectionsFormArray(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  // --- Computed ---
  readonly canCancel = computed(() => !this.isSaving());

  readonly canSave = computed(() => !this.isSaving());

  readonly previewSections = computed<SectionDisplayData[]>(() => {
    this.previewOpen();
    if (!this.form) return [];
    const arr = this.sectionsFormArray;
    if (!arr) return [];
    return arr.controls.map(ctrl => {
      const g = ctrl as FormGroup;
      return {
        title: g.get('title')?.value ?? '',
        content: g.get('content')?.value ?? '',
        icon: g.get('icon')?.value ?? '',
      };
    });
  });

  constructor() {
    addIcons({
      addOutline, eyeOutline, closeOutline, createOutline, saveOutline,
      chevronUpOutline, chevronDownOutline, trashOutline,
  chevronDown, informationCircleOutline
    });
  }

  async ngOnInit(): Promise<void> {
    this.clubId = this.clubService.getCurrentClubId();
    if (this.clubId !== null) {
      await this.loadSections();
    }
    this.loading.set(false);
  }

  // --- Data Loading ---

  private async loadSections(): Promise<void> {
    if (this.clubId === null) return;
    const data = await this.clubInformationService.getByClubId(this.clubId);
    this.originalSections = JSON.parse(JSON.stringify(data));
    this.buildFormArray(data);
  }

  private buildFormArray(sections: ClubInformation[]): void {
    this.form = this.fb.group({
      sections: this.fb.array(sections.map(s => this.buildSectionGroup(s)))
    });
  }

  private buildSectionGroup(section: ClubInformation): FormGroup {
    return this.fb.group({
      id: [section.id],
      title: [section.title, [Validators.required, Validators.maxLength(200)]],
      content: [section.content, [Validators.required, Validators.maxLength(2000)]],
      icon: [section.icon ?? ''],
      sortOrder: [section.sortOrder],
    });
  }

  private buildEmptySectionGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      icon: [''],
      sortOrder: [this.sectionsFormArray.length],
    });
  }

  // --- Section CRUD (in-memory) ---

  addSection(): void {
    const newGroup = this.buildEmptySectionGroup();
    this.sectionsFormArray.push(newGroup);
    // Expand the newly added section
    this.expandedIndex.set(this.sectionsFormArray.length - 1);
  }

  removeSection(index: number): void {
    this.sectionsFormArray.removeAt(index);
    // If expanded section was removed, collapse
    if (this.expandedIndex() === index) {
      this.expandedIndex.set(null);
    } else if (this.expandedIndex() !== null && this.expandedIndex()! > index) {
      this.expandedIndex.update(i => i !== null ? i - 1 : null);
    }
    // Re-index sort orders
    this.updateSortOrders();
  }

  moveSectionUp(index: number): void {
    if (index <= 0) return;
    this.swapSections(index, index - 1);
  }

  moveSectionDown(index: number): void {
    if (index >= this.sectionsFormArray.length - 1) return;
    this.swapSections(index, index + 1);
  }

  private swapSections(indexA: number, indexB: number): void {
    const ctrlA = this.sectionsFormArray.at(indexA);
    const ctrlB = this.sectionsFormArray.at(indexB);

    this.sectionsFormArray.removeAt(indexB);
    this.sectionsFormArray.insert(indexB, ctrlA as FormGroup);
    this.sectionsFormArray.removeAt(indexA);
    this.sectionsFormArray.insert(indexA, ctrlB as FormGroup);

    // Keep expanded index in sync
    const exp = this.expandedIndex();
    if (exp === indexA) this.expandedIndex.set(indexB);
    else if (exp === indexB) this.expandedIndex.set(indexA);

    this.updateSortOrders();
  }

  private updateSortOrders(): void {
    this.sectionsFormArray.controls.forEach((ctrl, i) => {
      ctrl.get('sortOrder')?.setValue(i, { emitEvent: false });
    });
  }

  // --- Collapsible ---

  toggleExpand(index: number): void {
    this.expandedIndex.update(current => current === index ? null : index);
  }

  asFormGroup(index: number): FormGroup {
    return this.sectionsFormArray.at(index) as FormGroup;
  }

  sectionHasError(index: number, controlName: string): boolean {
    const ctrl = this.asFormGroup(index).get(controlName);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  // --- Icon Picker ---

  openIconPicker(index: number): void {
    this.iconPickerTargetIndex.set(index);
    this.isIconPickerOpen.set(true);
  }

  closeIconPicker(): void {
    this.isIconPickerOpen.set(false);
    this.iconPickerTargetIndex.set(null);
  }

  onIconSelected(icon: string): void {
    const idx = this.iconPickerTargetIndex();
    if (idx !== null && idx < this.sectionsFormArray.length) {
      this.asFormGroup(idx).get('icon')?.setValue(icon);
    }
    this.closeIconPicker();
  }

  clearIcon(index: number): void {
    this.asFormGroup(index).get('icon')?.setValue('');
  }

  getSelectedIcon(): string {
    const idx = this.iconPickerTargetIndex();
    if (idx !== null && idx < this.sectionsFormArray.length) {
      return this.asFormGroup(idx).get('icon')?.value ?? '';
    }
    return '';
  }

  // --- Preview ---

  togglePreview(): void {
    this.previewOpen.set(true);
  }

  // --- Save (batch) ---

  async saveAll(): Promise<void> {
    if (this.clubId === null || this.isSaving()) return;

    // Validate all sections
    let hasErrors = false;
    this.sectionsFormArray.controls.forEach(ctrl => {
      ctrl.markAllAsTouched();
      if (ctrl.invalid) hasErrors = true;
    });

    if (hasErrors) {
      this.toastService.show(
        this.translationService.instant('admin.settings.information.formInvalid'),
        'danger'
      );
      return;
    }

    this.isSaving.set(true);

    try {
      const working = this.sectionsFormArray.getRawValue() as SectionFormValue[];

      // Identify new sections (no id)
      const newSections = working.filter(s => s.id === null && s.title.trim());
      // Identify existing sections (have id)
      const existingSections = working.filter(s => s.id !== null);

      // Identify deleted sections (in original but not in working)
      const workingIds = new Set(existingSections.map(s => s.id!));
      const deletedIds = this.originalSections
        .filter(s => !workingIds.has(s.id))
        .map(s => s.id);

      // Execute in order: deletes → creates → updates → reorder
      for (const id of deletedIds) {
        await this.clubInformationService.delete(this.clubId, id);
      }

      // Track created sections to get their server IDs for reordering
      const createdResults: ClubInformation[] = [];
      for (const section of newSections) {
        const req: CreateClubInformationRequest = {
          title: section.title.trim(),
          content: section.content.trim(),
          icon: section.icon?.trim() || null,
        };
        const created = await this.clubInformationService.create(this.clubId, req);
        createdResults.push(created);
      }

      for (const section of existingSections) {
        const original = this.originalSections.find(s => s.id === section.id);
        if (original && this.sectionHasChanged(section, original)) {
          const req: UpdateClubInformationRequest = {
            title: section.title.trim(),
            content: section.content.trim(),
            icon: section.icon?.trim() || null,
          };
          await this.clubInformationService.update(this.clubId, section.id!, req);
        }
      }

      // Build reorder list: map working order → server IDs
      const reorderIds = this.buildReorderIds(working, existingSections, createdResults);
      if (reorderIds.length > 1) {
        await this.clubInformationService.reorder(this.clubId, { ids: reorderIds });
      }

      this.toastService.show(
        this.translationService.instant('admin.settings.information.saveSuccess'),
        'success'
      );

      // Reload to sync with server state
      await this.loadSections();
      this.expandedIndex.set(null);
    } catch {
      this.toastService.show(
        this.translationService.instant('admin.settings.information.saveError'),
        'danger'
      );
    } finally {
      this.isSaving.set(false);
      this.navigationService.goBack();

    }
  }

  async cancel(): Promise<void> {
    this.buildFormArray(this.originalSections);
    this.expandedIndex.set(null);
  }

  // --- Helpers ---

  onToastDismiss(): void {
    this.toastService.hide();
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  private sectionHasChanged(w: SectionFormValue, o: ClubInformation): boolean {
    return (
      w.title.trim() !== o.title ||
      w.content.trim() !== o.content ||
      (w.icon.trim() || null) !== (o.icon || null)
    );
  }

  private buildReorderIds(
    working: SectionFormValue[],
    existingSections: SectionFormValue[],
    createdResults: ClubInformation[]
  ): number[] {
    // Map new sections (null id) by their position in working, assigned in order to createdResults
    let createdIdx = 0;
    const ordered: number[] = [];

    for (const w of working) {
      if (w.id !== null) {
        // Existing section — use its server ID
        ordered.push(w.id);
      } else {
        // New section — use the next created result ID
        if (createdIdx < createdResults.length) {
          ordered.push(createdResults[createdIdx].id);
          createdIdx++;
        }
      }
    }

    return ordered;
  }
}
