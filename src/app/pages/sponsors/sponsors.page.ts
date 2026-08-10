import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SponsorService } from '@core/services/sponsor.service';
import { ClubService } from '@services/club.service';
import { Sponsor, SponsorTier } from '@core/models/sponsor.model';
import { SponsorsDisplayComponent } from '@components/sponsors-display/sponsors-display.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner, TranslatePipe, SponsorsDisplayComponent]
})
export class SponsorsPage implements OnInit {
  private readonly sponsorService = inject(SponsorService);
  private readonly clubService = inject(ClubService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly sponsors = signal<Sponsor[]>([]);
  readonly allEmpty = signal(false);
  readonly clubId = signal(0);

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    this.clubId.set(clubId);
    try {
      this.loading.set(true);
      // Fetch only the sponsor tier eagerly; the collaborator tier is fetched
      // separately and deferred (see sponsors-collaborators-grid) so we avoid
      // a single get-all call when the page usually only needs one tier above the fold.
      const data = await this.sponsorService.getByClubId(clubId, SponsorTier.Sponsor);
      this.sponsors.set(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } catch {
      // Silently fail — show empty state
    } finally {
      this.loading.set(false);
    }
  }

  contactSponsor(): void {
    this.router.navigate(['../contact'], {
      relativeTo: this.route,
      queryParams: { type: 'sponsors' }
    });
  }
}
