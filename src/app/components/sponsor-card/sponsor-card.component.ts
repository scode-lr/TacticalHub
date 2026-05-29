import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { SponsorFormComponent, SponsorFormSaveEvent } from '@components/sponsor-form/sponsor-form.component';
import { Sponsor, SponsorTier } from '@core/models/sponsor.model';
import { addIcons } from 'ionicons';
import { chevronUpOutline, chevronDownOutline, trashOutline, starOutline, ribbonOutline, medalOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sponsor-card',
  templateUrl: './sponsor-card.component.html',
  styleUrls: ['./sponsor-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, SponsorFormComponent]
})
export class SponsorCardComponent {
  readonly sponsor = input<Sponsor | null>(null);
  readonly index = input<number>(0);
  readonly expanded = input<boolean>(false);
  readonly isFirst = input<boolean>(false);
  readonly isLast = input<boolean>(false);
  readonly isSaving = input<boolean>(false);
  readonly addMode = input<boolean>(false);

  readonly expand = output<number>();
  readonly moveUp = output<number>();
  readonly moveDown = output<number>();
  readonly delete = output<number>();
  readonly save = output<{ index: number; event: SponsorFormSaveEvent }>();
  readonly cancel = output<number>();
  readonly directSave = output<SponsorFormSaveEvent>();
  readonly directCancel = output<void>();

  constructor() {
    addIcons({ chevronUpOutline, chevronDownOutline, trashOutline, starOutline, ribbonOutline, medalOutline });
  }

  tierIcon(tier: SponsorTier): string {
    switch (tier) {
      case SponsorTier.Gold: return 'star-outline';
      case SponsorTier.Silver: return 'ribbon-outline';
      case SponsorTier.Bronze: return 'medal-outline';
      default: return 'medal-outline';
    }
  }

  tierLabel(tier: SponsorTier): string {
    switch (tier) {
      case SponsorTier.Gold: return 'admin.settings.sponsors.tier.gold';
      case SponsorTier.Silver: return 'admin.settings.sponsors.tier.silver';
      case SponsorTier.Bronze: return 'admin.settings.sponsors.tier.bronze';
      default: return 'admin.settings.sponsors.tier.bronze';
    }
  }

  onExpand(): void { this.expand.emit(this.index()); }
  onMoveUp(): void { this.moveUp.emit(this.index()); }
  onMoveDown(): void { this.moveDown.emit(this.index()); }
  onDelete(): void { this.delete.emit(this.index()); }
  onSave(event: SponsorFormSaveEvent): void { this.save.emit({ index: this.index(), event }); }
  onCancel(): void { this.cancel.emit(this.index()); }
  onDirectSave(event: SponsorFormSaveEvent): void { this.directSave.emit(event); }
  onDirectCancel(): void { this.directCancel.emit(); }
}
