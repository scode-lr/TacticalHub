import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { SponsorService } from '@core/services/sponsor.service';
import { Sponsor, SponsorTier } from '@core/models/sponsor.model';
import { SponsorTileComponent } from '@components/sponsor-tile/sponsor-tile.component';

@Component({
  selector: 'app-sponsors-collaborators-grid',
  templateUrl: './sponsors-collaborators-grid.component.html',
  styleUrls: ['./sponsors-collaborators-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner, TranslatePipe, SponsorTileComponent]
})
export class SponsorsCollaboratorsGridComponent implements OnInit {
  private readonly sponsorService = inject(SponsorService);

  readonly clubId = input.required<number>();

  readonly sponsorSelected = output<Sponsor>();
  readonly loaded = output<Sponsor[]>();

  readonly loading = signal(true);
  readonly collaborators = signal<Sponsor[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.sponsorService.getByClubId(this.clubId(), SponsorTier.Collaborator);
      this.collaborators.set(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } catch {
      // Silently fail — section stays empty
    } finally {
      this.loading.set(false);
      this.loaded.emit(this.collaborators());
    }
  }

  onSelect(sponsor: Sponsor): void {
    this.sponsorSelected.emit(sponsor);
  }
}
