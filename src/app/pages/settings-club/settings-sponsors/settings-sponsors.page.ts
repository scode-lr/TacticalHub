import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@core/services/i18n/translation.service';
import { SponsorService } from '@core/services/sponsor.service';
import { NavigationService } from '@services/navigation.service';
import { ToastService } from '@services/toast.service';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { PreviewModalComponent } from '@components/modals/preview-modal/preview-modal.component';
import { SectionFooterActionsComponent } from '@components/section-footer-actions/section-footer-actions.component';
import { SponsorFormSaveEvent } from '@components/sponsor-form/sponsor-form.component';
import { SponsorCardComponent } from '@components/sponsor-card/sponsor-card.component';
import { SponsorDetailComponent } from '@components/sponsor-detail/sponsor-detail.component';
import { Sponsor } from '@core/models/sponsor.model';
import { addIcons } from 'ionicons';
import { addOutline, walletOutline, arrowBackOutline, saveOutline } from 'ionicons/icons';
import { ClubService } from '@services/club.service';

@Component({
  selector: 'app-settings-sponsors',
  templateUrl: './settings-sponsors.page.html',
  styleUrls: ['./settings-sponsors.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner, IonToast, TranslatePipe, BackButtonComponent, PreviewModalComponent, SectionFooterActionsComponent, SponsorCardComponent, SponsorDetailComponent]
})
export class SettingsSponsorsPage implements OnInit {
  private readonly sponsorService = inject(SponsorService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);
  private readonly clubService = inject(ClubService);

  readonly sponsors = signal<Sponsor[]>([]);
  readonly loading = signal(true);
  readonly isSaving = signal(false);
  readonly expandedIndex = signal<number | null>(null);
  readonly isAdding = signal(false);
  readonly previewOpen = signal(false);

  readonly showToast = this.toastService.showToast;
  readonly toastMessage = this.toastService.toastMessage;
  readonly toastColor = this.toastService.toastColor;

  private tempIdCounter = -1;
  private pendingAdditions = new Map<number, SponsorFormSaveEvent>();
  private pendingUpdates = new Map<number, SponsorFormSaveEvent>();
  private pendingDeletions = new Set<number>();
  private orphanedImageUrls = new Set<string>();
  private pendingVersion = signal(0);

  private markPendingChanged(): void {
    this.pendingVersion.update(v => v + 1);
  }

  readonly canCancel = computed(() => !this.isSaving());
  readonly canSave = computed(() => {
    this.pendingVersion();
    return !this.isSaving() &&
      (this.pendingAdditions.size > 0 ||
       this.pendingUpdates.size > 0 ||
       this.pendingDeletions.size > 0);
  });

  readonly previewSponsors = computed(() => {
    this.previewOpen();
    return this.sponsors();
  });

  private clubId: number = 0;

  constructor() {
    addIcons({ addOutline, walletOutline, arrowBackOutline, saveOutline });
  }

  async ngOnInit(): Promise<void> {
    this.clubId = this.clubService.getCurrentClubId() ?? 0;
    await this.loadSponsors();
  }

  async loadSponsors(): Promise<void> {
    try {
      this.loading.set(true);
      const data = await this.sponsorService.getByClubId(this.clubId);
      this.sponsors.set(data);
    } catch {
      this.showToastMessage('sponsors.error.load', 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  private createDraftSponsor(id: number, data: SponsorFormSaveEvent['data'], imageUrl: string): Sponsor {
    const now = new Date().toISOString();
    return {
      id,
      clubId: this.clubId,
      name: data.name,
      tier: data.tier,
      title: data.title ?? null,
      description: data.description ?? null,
      additionalInfo: data.additionalInfo ?? [],
      imageUrl,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  private buildSponsorForBatch(sponsor: Sponsor): Sponsor {
    return {
      ...sponsor,
      sortOrder: this.sponsors().findIndex(s => s.id === sponsor.id),
    };
  }

  // ---- Add sponsor ----

  startAdding(): void {
    this.isAdding.set(true);
    this.expandedIndex.set(null);
  }

  cancelAdding(): void {
    this.isAdding.set(false);
  }

  async onAddSave(event: SponsorFormSaveEvent): Promise<void> {
    const tempId = this.tempIdCounter--;
    let imageUrl = '';

    if (event.imageFile) {
      imageUrl = URL.createObjectURL(event.imageFile);
    }

    const draft = this.createDraftSponsor(tempId, event.data, imageUrl);
    this.sponsors.update(list => [...list, draft]);
    this.cancelAdding();

    if (event.imageFile) {
      try {
        const result = await this.sponsorService.uploadImage(this.clubId, event.imageFile);
        imageUrl = result.url;
        URL.revokeObjectURL(draft.imageUrl);
        this.sponsors.update(list =>
          list.map(s => s.id === tempId ? { ...s, imageUrl: result.url } : s)
        );
      } catch {
        this.showToastMessage('sponsors.error.imageUpload', 'danger');
      }
    }

    this.pendingAdditions.set(tempId, event);
    this.markPendingChanged();
  }

  // ---- Edit sponsor ----

  toggleExpand(index: number): void {
    if (this.expandedIndex() === index) {
      this.expandedIndex.set(null);
      return;
    }
    this.isAdding.set(false);
    this.expandedIndex.set(index);
  }

  async onEditSave(index: number, event: SponsorFormSaveEvent): Promise<void> {
    const sponsor = this.sponsors()[index];
    let imageUrl = event.data.existingImageUrl || '';

    if (event.imageFile) {
      if (event.data.existingImageUrl && event.data.existingImageUrl.startsWith('http')) {
        this.orphanedImageUrls.add(event.data.existingImageUrl);
      }
      if (sponsor.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(sponsor.imageUrl);
      }

      try {
        const result = await this.sponsorService.uploadImage(this.clubId, event.imageFile);
        imageUrl = result.url;
      } catch {
        this.showToastMessage('sponsors.error.imageUpload', 'danger');
      }
    }

    const updated: Sponsor = {
      ...sponsor,
      name: event.data.name,
      tier: event.data.tier,
      title: event.data.title ?? null,
      description: event.data.description ?? null,
      additionalInfo: event.data.additionalInfo ?? [],
      imageUrl,
      updatedAt: new Date().toISOString(),
    };

    this.sponsors.update(list => { const copy = [...list]; copy[index] = updated; return copy; });

    if (sponsor.id < 0) {
      this.pendingAdditions.set(sponsor.id, event);
    } else {
      this.pendingUpdates.set(sponsor.id, event);
    }

    this.markPendingChanged();
    this.expandedIndex.set(null);
  }

  // ---- Delete ----

  deleteSponsor(index: number): void {
    const sponsor = this.sponsors()[index];
    this.sponsors.update(list => list.filter((_, i) => i !== index));

    if (sponsor.id < 0) {
      this.pendingAdditions.delete(sponsor.id);
      if (sponsor.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(sponsor.imageUrl);
      } else if (sponsor.imageUrl.startsWith('http')) {
        this.orphanedImageUrls.add(sponsor.imageUrl);
      }
    } else {
      this.pendingUpdates.delete(sponsor.id);
      this.pendingDeletions.add(sponsor.id);
    }

    if (sponsor.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(sponsor.imageUrl);
    }

    this.markPendingChanged();

    if (this.expandedIndex() === index) this.expandedIndex.set(null);
    else if (this.expandedIndex() !== null && this.expandedIndex()! > index) this.expandedIndex.update(i => i! - 1);
  }

  // ---- Reorder ----

  moveUp(index: number): void { if (index === 0) return; this.swapLocal(index, index - 1); }
  moveDown(index: number): void {
    const list = this.sponsors();
    if (index >= list.length - 1) return;
    this.swapLocal(index, index + 1);
  }

  private swapLocal(fromIndex: number, toIndex: number): void {
    const list = [...this.sponsors()];
    [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];
    this.sponsors.set(list);
  }

  // ---- Preview ----

  togglePreview(): void {
    this.previewOpen.set(true);
  }

  // ---- Batch Actions ----

  cancelAll(): void {
    this.expandedIndex.set(null);
    this.isAdding.set(false);
    this.pendingAdditions.clear();
    this.pendingUpdates.clear();
    this.pendingDeletions.clear();
    this.markPendingChanged();
    this.deleteOrphanedImages();
    this.loadSponsors();
  }

  async saveAll(): Promise<void> {
    if (this.isSaving()) return;
    this.isSaving.set(true);
    try {
      const list = this.sponsors();
      const additions: Sponsor[] = [];
      const updates: Sponsor[] = [];

      for (const [tempId] of this.pendingAdditions) {
        const draft = list.find(s => s.id === tempId);
        if (draft) additions.push(this.buildSponsorForBatch(draft));
      }

      for (const [id] of this.pendingUpdates) {
        const sponsor = list.find(s => s.id === id);
        if (sponsor) updates.push(this.buildSponsorForBatch(sponsor));
      }

      await this.sponsorService.batch(this.clubId, {
        additions,
        updates,
        deletions: [...this.pendingDeletions],
        orphanedImageUrls: [...this.orphanedImageUrls],
      });

      this.pendingAdditions.clear();
      this.pendingUpdates.clear();
      this.pendingDeletions.clear();
      this.orphanedImageUrls.clear();
      this.markPendingChanged();

      await this.loadSponsors();
      this.toastService.show(this.translationService.instant('admin.settings.sponsors.saved'), 'success');
      this.navigationService.goBack();
    } catch {
      this.toastService.show(this.translationService.instant('admin.settings.sponsors.error.saveAll'), 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ---- Helpers ----

  private async deleteOrphanedImages(): Promise<void> {
    const urls = [...this.orphanedImageUrls].filter(Boolean);
    if (urls.length > 0) {
      try { await this.sponsorService.deleteImages(this.clubId, urls); } catch { }
    }
    this.orphanedImageUrls.clear();
  }

  goBack(): void { this.navigationService.goBack(); }

  onToastDismiss(): void {
    this.toastService.hide();
  }

  private showToastMessage(messageKey: string, color: 'success' | 'danger' | 'warning'): void {
    this.toastService.show(this.translationService.instant(messageKey), color);
  }
}
