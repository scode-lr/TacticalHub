import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner, IonModal } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SponsorService } from '@core/services/sponsor.service';
import { ClubService } from '@services/club.service';
import { Sponsor, SponsorTier } from '@core/models/sponsor.model';
import { SponsorDetailComponent } from '@components/sponsor-detail/sponsor-detail.component';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner, IonModal, TranslatePipe, SponsorDetailComponent]
})
export class PartnersPage implements OnInit {
  private readonly sponsorService = inject(SponsorService);
  private readonly clubService = inject(ClubService);

  readonly loading = signal(true);
  readonly sponsors = signal<Sponsor[]>([]);
  readonly selectedSponsor = signal<Sponsor | null>(null);

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    try {
      this.loading.set(true);
      const data = await this.sponsorService.getByClubId(clubId);
      this.sponsors.set(data.sort((a, b) => b.tier - a.tier));
    } catch {
      // Silently fail — show empty state
    } finally {
      this.loading.set(false);
    }
  }

  openSponsor(sponsor: Sponsor): void {
    this.selectedSponsor.set(sponsor);
  }

  closeSponsor(): void {
    this.selectedSponsor.set(null);
  }

  tierLabel(tier: SponsorTier): string {
    switch (tier) {
      case SponsorTier.Gold: return 'admin.settings.sponsors.tier.gold';
      case SponsorTier.Silver: return 'admin.settings.sponsors.tier.silver';
      case SponsorTier.Bronze: return 'admin.settings.sponsors.tier.bronze';
    }
  }

  tierClass(tier: SponsorTier): string {
    switch (tier) {
      case SponsorTier.Gold: return 'tier-gold';
      case SponsorTier.Silver: return 'tier-silver';
      case SponsorTier.Bronze: return 'tier-bronze';
    }
  }

}
