import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SponsorService } from '@core/services/sponsor.service';
import { ClubService } from '@services/club.service';
import { Sponsor } from '@core/models/sponsor.model';
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

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    try {
      this.loading.set(true);
      const data = await this.sponsorService.getByClubId(clubId);
      this.sponsors.set(data.sort((a, b) => b.tier - a.tier || a.sortOrder - b.sortOrder));
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
