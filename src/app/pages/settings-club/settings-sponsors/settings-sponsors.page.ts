import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { TranslationService } from '@core/services/i18n/translation.service';
import { SponsorService } from '@core/services/sponsor.service';
import { NavigationService } from '@services/navigation.service';
import { Sponsor, SponsorTier, SponsorLink, ReorderSponsorsRequest } from '@core/models/sponsor.model';
import { addIcons } from 'ionicons';
import {
  addOutline, trashOutline, chevronUpOutline, chevronDownOutline,
  imageOutline, cloudUploadOutline, closeOutline, checkmarkOutline,
  medalOutline, ribbonOutline, starOutline, walletOutline,
  arrowBackOutline, saveOutline, linkOutline, globeOutline
} from 'ionicons/icons';
import { ClubService } from '@services/club.service';

@Component({
  selector: 'app-settings-sponsors',
  templateUrl: './settings-sponsors.page.html',
  styleUrls: ['./settings-sponsors.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonSpinner, TranslatePipe]
})
export class SettingsSponsorsPage implements OnInit {
  private readonly sponsorService = inject(SponsorService);
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);
  private readonly fb = inject(FormBuilder);
  private readonly toastController = inject(ToastController);
  private readonly clubService = inject(ClubService);

  readonly sponsors = signal<Sponsor[]>([]);
  readonly loading = signal(true);
  readonly isSaving = signal(false);
  readonly expandedIndex = signal<number | null>(null);
  readonly isAdding = signal(false);
  readonly addFormImagePreview = signal<string | null>(null);
  readonly editFormImagePreview = signal<string | null>(null);

  readonly tierOptions = [
    { value: SponsorTier.Gold, label: 'sponsors.tier.gold', icon: 'star-outline' },
    { value: SponsorTier.Silver, label: 'sponsors.tier.silver', icon: 'ribbon-outline' },
    { value: SponsorTier.Bronze, label: 'sponsors.tier.bronze', icon: 'medal-outline' }
  ];

  readonly socialPlatforms = [
    'instagram', 'twitter', 'facebook', 'tiktok', 'youtube',
    'linkedin', 'twitch', 'website', 'whatsapp', 'telegram'
  ];

  // Add form
  readonly addForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    tier: [SponsorTier.Bronze, [Validators.required]],
    title: ['', [Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(500)]],
    image: [null],
    links: this.fb.array([])
  });

  // Edit form
  editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    tier: [SponsorTier.Bronze, [Validators.required]],
    title: ['', [Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(500)]],
    image: [null],
    links: this.fb.array([])
  });

  private selectedAddImage: File | null = null;
  private selectedEditImage: File | null = null;
  private clubId: number = 0;

  get addName() { return this.addForm.get('name') as FormControl; }
  get addTier() { return this.addForm.get('tier') as FormControl; }
  get addTitle() { return this.addForm.get('title') as FormControl; }
  get addDescription() { return this.addForm.get('description') as FormControl; }
  get addLinks() { return this.addForm.get('links') as FormArray; }
  get editName() { return this.editForm.get('name') as FormControl; }
  get editTier() { return this.editForm.get('tier') as FormControl; }
  get editTitle() { return this.editForm.get('title') as FormControl; }
  get editDescription() { return this.editForm.get('description') as FormControl; }
  get editLinks() { return this.editForm.get('links') as FormArray; }
  get hasAddImage(): boolean { return this.selectedAddImage !== null; }
  getLinkGroup(control: any): FormGroup { return control as FormGroup; }

  constructor() {
    addIcons({
      addOutline, trashOutline, chevronUpOutline, chevronDownOutline,
      imageOutline, cloudUploadOutline, closeOutline, checkmarkOutline,
      medalOutline, ribbonOutline, starOutline, walletOutline,
      arrowBackOutline, saveOutline, linkOutline, globeOutline
    });
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
      await this.showToast('sponsors.error.load', 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  // ---- Links helpers ----

  linksArray(form: FormGroup): FormArray {
    return form.get('links') as FormArray;
  }

  addLink(form: FormGroup): void {
    const links = this.linksArray(form);
    if (links.length >= 10) return;
    links.push(this.fb.group({
      platform: ['', [Validators.required]],
      url: ['', [Validators.required]]
    }));
  }

  removeLink(form: FormGroup, index: number): void {
    const links = this.linksArray(form);
    links.removeAt(index);
  }

  getLinksValue(form: FormGroup): SponsorLink[] {
    return this.linksArray(form).value
      .filter((l: SponsorLink) => l.platform && l.url);
  }

  // ---- Add sponsor ----

  startAdding(): void {
    this.isAdding.set(true);
    this.expandedIndex.set(null);
    this.addForm.reset({ name: '', tier: SponsorTier.Bronze, title: '', description: '', image: null });
    this.addLinks.clear();
    this.selectedAddImage = null;
    this.addFormImagePreview.set(null);
  }

  cancelAdding(): void {
    this.isAdding.set(false);
    this.selectedAddImage = null;
    this.addFormImagePreview.set(null);
  }

  onAddImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) { this.showToast('sponsors.error.imageSize', 'danger'); return; }
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) { this.showToast('sponsors.error.imageType', 'danger'); return; }
      this.selectedAddImage = file;
      const reader = new FileReader();
      reader.onload = () => { this.addFormImagePreview.set(reader.result as string); };
      reader.readAsDataURL(file);
    }
  }

  async saveNewSponsor(): Promise<void> {
    if (this.addForm.invalid || !this.selectedAddImage) {
      this.addForm.markAllAsTouched();
      if (!this.selectedAddImage) await this.showToast('sponsors.error.imageRequired', 'warning');
      return;
    }
    try {
      this.isSaving.set(true);

      const sponsor = await this.sponsorService.create(this.clubId, {
        name: this.addForm.value.name.trim(),
        tier: this.addForm.value.tier,
        image: this.selectedAddImage,
        title: this.addForm.value.title?.trim() || undefined,
        description: this.addForm.value.description?.trim() || undefined,
        links: this.getLinksValue(this.addForm)
      });
      this.sponsors.update(list => [...list, sponsor]);
      this.cancelAdding();
      await this.showToast('sponsors.created', 'success');
    } catch {
      await this.showToast('sponsors.error.create', 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ---- Edit sponsor ----

  toggleExpand(index: number): void {
    if (this.expandedIndex() === index) {
      this.expandedIndex.set(null);
      this.selectedEditImage = null;
      this.editFormImagePreview.set(null);
      return;
    }
    this.isAdding.set(false);
    this.expandedIndex.set(index);
    const sponsor = this.sponsors()[index];
    this.editForm = this.fb.group({
      name: [sponsor.name, [Validators.required, Validators.maxLength(200)]],
      tier: [sponsor.tier, [Validators.required]],
      title: [sponsor.title || '', [Validators.maxLength(200)]],
      description: [sponsor.description || '', [Validators.maxLength(500)]],
      image: [null],
      links: this.fb.array((sponsor.links || []).map(l =>
        this.fb.group({ platform: [l.platform, Validators.required], url: [l.url, Validators.required] })
      ))
    });
    this.editFormImagePreview.set(sponsor.imageUrl);
    this.selectedEditImage = null;
  }

  onEditImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) { this.showToast('sponsors.error.imageSize', 'danger'); return; }
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) { this.showToast('sponsors.error.imageType', 'danger'); return; }
      this.selectedEditImage = file;
      const reader = new FileReader();
      reader.onload = () => { this.editFormImagePreview.set(reader.result as string); };
      reader.readAsDataURL(file);
    }
  }

  async saveEdit(): Promise<void> {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    const index = this.expandedIndex();
    if (index === null) return;
    const sponsor = this.sponsors()[index];
    try {
      this.isSaving.set(true);
      const updated = await this.sponsorService.update(this.clubId, sponsor.id, {
        name: this.editForm.value.name.trim(),
        tier: this.editForm.value.tier,
        image: this.selectedEditImage ?? undefined,
        title: this.editForm.value.title?.trim() || undefined,
        description: this.editForm.value.description?.trim() || undefined,
        links: this.getLinksValue(this.editForm)
      });
      this.sponsors.update(list => { const copy = [...list]; copy[index] = updated; return copy; });
      this.expandedIndex.set(null);
      this.selectedEditImage = null;
      this.editFormImagePreview.set(null);
      await this.showToast('sponsors.updated', 'success');
    } catch {
      await this.showToast('sponsors.error.update', 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ---- Delete ----

  async deleteSponsor(index: number): Promise<void> {
    const sponsor = this.sponsors()[index];
    try {
      this.isSaving.set(true);
      await this.sponsorService.delete(this.clubId, sponsor.id);
      this.sponsors.update(list => list.filter((_, i) => i !== index));
      if (this.expandedIndex() === index) this.expandedIndex.set(null);
      else if (this.expandedIndex() !== null && this.expandedIndex()! > index) this.expandedIndex.update(i => i! - 1);
      await this.showToast('sponsors.deleted', 'success');
    } catch {
      await this.showToast('sponsors.error.delete', 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ---- Reorder ----

  async moveUp(index: number): Promise<void> { if (index === 0) return; await this.swapAndReorder(index, index - 1); }
  async moveDown(index: number): Promise<void> {
    const list = this.sponsors();
    if (index >= list.length - 1) return;
    await this.swapAndReorder(index, index + 1);
  }

  private async swapAndReorder(fromIndex: number, toIndex: number): Promise<void> {
    const list = [...this.sponsors()];
    [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];
    this.sponsors.set(list);
    try {
      await this.sponsorService.reorder(this.clubId, { ids: list.map(s => s.id) } as ReorderSponsorsRequest);
    } catch {
      await this.loadSponsors();
      await this.showToast('sponsors.error.reorder', 'danger');
    }
  }

  // ---- Helpers ----

  tierIcon(tier: SponsorTier): string {
    switch (tier) { case SponsorTier.Gold: return 'star-outline'; case SponsorTier.Silver: return 'ribbon-outline'; case SponsorTier.Bronze: return 'medal-outline'; }
  }

  tierLabel(tier: SponsorTier): string {
    switch (tier) { case SponsorTier.Gold: return 'sponsors.tier.gold'; case SponsorTier.Silver: return 'sponsors.tier.silver'; case SponsorTier.Bronze: return 'sponsors.tier.bronze'; }
  }

  goBack(): void { this.navigationService.goBack(); }

  private async showToast(messageKey: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({
      message: this.translationService.instant(messageKey), duration: 2500, color, position: 'bottom',
      buttons: [{ icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
