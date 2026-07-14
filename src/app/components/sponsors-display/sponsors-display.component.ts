import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { Sponsor, SponsorTier } from '@core/models/sponsor.model';
import { SponsorDetailComponent } from '@components/sponsor-detail/sponsor-detail.component';
import { DefaultImageDirective } from '@core/directives';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sponsors-display',
  templateUrl: './sponsors-display.component.html',
  styleUrls: ['./sponsors-display.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, TranslatePipe, SponsorDetailComponent, DefaultImageDirective]
})
export class SponsorsDisplayComponent {
  readonly sponsors = input<Sponsor[]>([]);

  readonly selectedSponsor = signal<Sponsor | null>(null);

  readonly tierSections = computed(() => {
    const list = this.sponsors();
    return [SponsorTier.Sponsor, SponsorTier.Collaborator]
      .map(tier => ({ tier, items: list.filter(s => s.tier === tier) }))
      .filter(section => section.items.length > 0);
  });

  constructor() {
    addIcons({ closeOutline });
  }

  openSponsor(sponsor: Sponsor): void {
    this.selectedSponsor.set(sponsor);
  }

  closeSponsor(): void {
    this.selectedSponsor.set(null);
  }

  tierClass(tier: SponsorTier): string {
    return tier === SponsorTier.Sponsor ? 'tier-sponsor' : 'tier-collaborator';
  }

  tierLabel(tier: SponsorTier): string {
    return tier === SponsorTier.Sponsor
      ? 'admin.settings.sponsors.tier.sponsor'
      : 'admin.settings.sponsors.tier.collaborator';
  }
}
