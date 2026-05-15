import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonModal, IonButton, IonTextarea, IonInput, IonItem, IonList, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ToastService } from '@services/toast.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { ClubInformationService } from '@services/club-information.service';
import { ClubService } from '@services/club.service';
import { ClubInformation, CreateClubInformationRequest, UpdateClubInformationRequest } from '@core/models/club-information.model';
import { IconPickerModalComponent } from '@components/modals/icon-picker-modal/icon-picker-modal.component';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, chevronUpOutline, chevronDownOutline, saveOutline, closeOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings-information',
  templateUrl: './settings-information.page.html',
  styleUrls: ['./settings-information.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonModal, IonButton, IonTextarea, IonInput, IonItem, IonList, IonItemSliding, IonItemOptions, IonItemOption, TranslatePipe, BackButtonComponent, IconPickerModalComponent]
})
export class SettingsInformationPage {
  private readonly clubInformationService = inject(ClubInformationService);
  private readonly clubService = inject(ClubService);
  private readonly toastService = inject(ToastService);

  readonly sections = signal<ClubInformation[]>([]);
  readonly loading = signal(true);
  readonly isModalOpen = signal(false);
  readonly editingSection = signal<ClubInformation | null>(null);
  readonly formTitle = signal('');
  readonly formContent = signal('');
  readonly formIcon = signal('');

  private clubId: number | null = null;

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, chevronUpOutline, chevronDownOutline, saveOutline, closeOutline, closeCircleOutline });
  }

  readonly isIconPickerOpen = signal(false);

  openIconPicker(): void {
    this.isIconPickerOpen.set(true);
  }

  closeIconPicker(): void {
    this.isIconPickerOpen.set(false);
  }

  onIconSelected(icon: string): void {
    this.formIcon.set(icon);
    this.closeIconPicker();
  }

  clearIcon(): void {
    this.formIcon.set('');
  }

  async ngOnInit(): Promise<void> {
    this.clubId = this.clubService.getCurrentClubId();
    if (this.clubId !== null) {
      await this.loadSections();
    }
    this.loading.set(false);
  }

  private async loadSections(): Promise<void> {
    if (this.clubId === null) return;
    const data = await this.clubInformationService.getByClubId(this.clubId);
    this.sections.set(data);
  }

  openCreateModal(): void {
    this.editingSection.set(null);
    this.formTitle.set('');
    this.formContent.set('');
    this.formIcon.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(section: ClubInformation): void {
    this.editingSection.set(section);
    this.formTitle.set(section.title);
    this.formContent.set(section.content);
    this.formIcon.set(section.icon ?? '');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingSection.set(null);
  }

  async saveSection(): Promise<void> {
    if (this.clubId === null) return;

    const title = this.formTitle().trim();
    const content = this.formContent().trim();
    const icon = this.formIcon().trim() || null;

    if (!title || !content) {
      this.toastService.show('Title and content are required', 'warning');
      return;
    }

    const editSection = this.editingSection();
    if (editSection) {
      const request: UpdateClubInformationRequest = { title, content, icon };
      await this.clubInformationService.update(this.clubId, editSection.id, request);
      this.toastService.show('Section updated successfully', 'success');
    } else {
      const request: CreateClubInformationRequest = { title, content, icon };
      await this.clubInformationService.create(this.clubId, request);
      this.toastService.show('Section created successfully', 'success');
    }

    this.closeModal();
    await this.loadSections();
  }

  async deleteSection(section: ClubInformation): Promise<void> {
    if (this.clubId === null) return;
    await this.clubInformationService.delete(this.clubId, section.id);
    this.toastService.show('Section deleted', 'success');
    await this.loadSections();
  }

  async moveUp(index: number): Promise<void> {
    if (index <= 0 || this.clubId === null) return;
    const items = [...this.sections()];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    this.sections.set(items);
    await this.persistOrder();
  }

  async moveDown(index: number): Promise<void> {
    const items = this.sections();
    if (index >= items.length - 1 || this.clubId === null) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    this.sections.set(newItems);
    await this.persistOrder();
  }

  private async persistOrder(): Promise<void> {
    if (this.clubId === null) return;
    const ids = this.sections().map(s => s.id);
    await this.clubInformationService.reorder(this.clubId, { ids });
  }
}
