import { Component, OnInit, input, output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Sponsor, SponsorTier, AdditionalInfo, SPONSOR_INFO_KEYS } from '@core/models/sponsor.model';
import { addIcons } from 'ionicons';
import { imageOutline, cloudUploadOutline, closeOutline, addOutline, trashOutline } from 'ionicons/icons';

export interface TierOption {
  value: SponsorTier;
  label: string;
  icon?: string;
}

export interface FormFieldConfig {
  key: string;
  type: 'text' | 'textarea' | 'select' | 'url' | 'email';
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
}

export interface SponsorFormData {
  name: string;
  tier: SponsorTier;
  title?: string;
  description?: string;
  image: File | null;
  additionalInfo: AdditionalInfo[];
  existingImageUrl?: string;
}

export interface SponsorFormSaveEvent {
  data: SponsorFormData;
  imageFile: File | null;
}

const DEFAULT_FIELDS: FormFieldConfig[] = [
  { key: 'name', type: 'text', label: 'admin.settings.sponsors.form.name', placeholder: 'admin.settings.sponsors.form.namePlaceholder', required: true, maxLength: 200 },
  { key: 'title', type: 'text', label: 'admin.settings.sponsors.form.title', placeholder: 'admin.settings.sponsors.form.titlePlaceholder', maxLength: 200 },
  { key: 'description', type: 'textarea', label: 'admin.settings.sponsors.form.description', placeholder: 'admin.settings.sponsors.form.descriptionPlaceholder', maxLength: 500 },
];

@Component({
  selector: 'app-sponsor-form',
  templateUrl: './sponsor-form.component.html',
  styleUrls: ['./sponsor-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonIcon, IonSpinner, TranslatePipe]
})
export class SponsorFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly sponsor = input<Sponsor | null>(null);
  readonly isSaving = input<boolean>(false);

  readonly save = output<SponsorFormSaveEvent>();
  readonly cancel = output<void>();

  readonly imagePreview = signal<string | null>(null);
  readonly imageLoading = signal(false);
  readonly imageError = signal<string | null>(null);

  readonly tierOptions: TierOption[] = [
    { value: SponsorTier.Gold, label: 'admin.settings.sponsors.tier.gold' },
    { value: SponsorTier.Silver, label: 'admin.settings.sponsors.tier.silver' },
    { value: SponsorTier.Bronze, label: 'admin.settings.sponsors.tier.bronze' }
  ];

  readonly infoKeys = SPONSOR_INFO_KEYS;

  form!: FormGroup;
  selectedImage: File | null = null;

  readonly fields = computed<FormFieldConfig[]>(() => [
    ...DEFAULT_FIELDS,
  ]);

  get name() { return this.form.get('name') as FormControl; }
  get tier() { return this.form.get('tier') as FormControl; }
  get additionalInfo() { return this.form.get('additionalInfo') as FormArray; }
  get hasImage(): boolean { return this.selectedImage !== null || !!this.sponsor()?.imageUrl; }

  getFieldControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  constructor() {
    addIcons({ imageOutline, cloudUploadOutline, closeOutline, addOutline, trashOutline });
  }

  ngOnInit(): void {
    const s = this.sponsor();
    const controls: Record<string, AbstractControl> = {};

    for (const field of this.fields()) {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      const value = this.getFieldDefault(field.key, field.defaultValue);
      controls[field.key] = new FormControl(value, validators);
    }

    controls['tier'] = new FormControl(s?.tier ?? SponsorTier.Bronze, [Validators.required]);
    controls['additionalInfo'] = this.fb.array(
      (s?.additionalInfo || []).map(l =>
        this.fb.group({ key: [l.key, Validators.required], value: [l.value, Validators.required] })
      )
    );

    this.form = this.fb.group(controls);

    if (s?.imageUrl) {
      this.imagePreview.set(s.imageUrl);
    }
  }

  private getFieldDefault(key: string, configDefault?: string | number): string {
    const s = this.sponsor();
    const inputMap: Record<string, string> = {
      name: s?.name ?? '',
      title: s?.title ?? '',
      description: s?.description ?? '',
    };
    return inputMap[key] ?? String(configDefault ?? '');
  }

  getInfoGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  addInfo(): void {
    if (this.additionalInfo.length >= 10) return;
    this.additionalInfo.push(this.fb.group({
      key: ['', [Validators.required]],
      value: ['', [Validators.required]]
    }));
  }

  removeInfo(index: number): void {
    this.additionalInfo.removeAt(index);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

    console.log('Selected file:', file);
    if (file.size > maxSize) {
      this.showFieldError('imageSize');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.showFieldError('imageType');
      return;
    }

    this.imageLoading.set(true);
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
      this.imageLoading.set(false);
      console.log('Image loaded successfully');
    };

    reader.onabort = () => {
      console.warn('Image loading aborted');
      this.imageLoading.set(false);
    }
    reader.onloadstart = () => {
      console.log('Image loading started');
    }
    reader.onerror = () => {
      console.error('Error reading image file');
      this.imageLoading.set(false);
    };
    reader.readAsDataURL(file);

    input.value = '';
  }

  clearImage(): void {
    this.selectedImage = null;
    this.imagePreview.set(this.sponsor()?.imageUrl ?? null);
  }

  private showFieldError(key: string): void {
    this.imageError.set(key);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const additionalInfoValue = (this.additionalInfo.value as AdditionalInfo[])
      .filter((i: AdditionalInfo) => i.key && i.value);

    this.save.emit({
      data: {
        name: this.form.value.name,
        tier: this.form.value.tier,
        title: this.form.value.title || undefined,
        description: this.form.value.description || undefined,
        image: this.selectedImage,
        additionalInfo: additionalInfoValue,
        existingImageUrl: this.sponsor()?.imageUrl ?? '',
      },
      imageFile: this.selectedImage,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
