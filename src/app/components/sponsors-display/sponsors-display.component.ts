import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { Sponsor } from '@core/models/sponsor.model';
import { SponsorDetailComponent } from '@components/sponsor-detail/sponsor-detail.component';
import { SponsorTileComponent } from '@components/sponsor-tile/sponsor-tile.component';
import { SponsorsCollaboratorsGridComponent } from '@components/sponsors-collaborators-grid/sponsors-collaborators-grid.component';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sponsors-display',
  templateUrl: './sponsors-display.component.html',
  styleUrls: ['./sponsors-display.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, TranslatePipe, SponsorDetailComponent, SponsorTileComponent, SponsorsCollaboratorsGridComponent]
})
export class SponsorsDisplayComponent {
  readonly sponsors = input<Sponsor[]>([]);

  /** Club ID used to lazily fetch the collaborator tier (live/member view). Omit in preview mode. */
  readonly clubId = input<number | null>(null);

  /**
   * Pre-supplied collaborator list — used by the admin preview modal, which
   * only has an in-memory (possibly unsaved) list and must render both tiers
   * without any API calls. When provided, this replaces the deferred fetch.
   */
  readonly collaborators = input<Sponsor[] | null>(null);

  readonly emptyChange = output<boolean>();

  readonly selectedSponsor = signal<Sponsor | null>(null);
  private readonly collaboratorsLoaded = signal(false);
  private readonly collaboratorsCount = signal(0);

  constructor() {
    addIcons({ closeOutline });

    effect(() => {
      const preSupplied = this.collaborators();
      if (preSupplied !== null) {
        this.emptyChange.emit(this.sponsors().length === 0 && preSupplied.length === 0);
      } else if (this.collaboratorsLoaded()) {
        this.emptyChange.emit(this.sponsors().length === 0 && this.collaboratorsCount() === 0);
      }
    });
  }

  openSponsor(sponsor: Sponsor): void {
    this.selectedSponsor.set(sponsor);
  }

  closeSponsor(): void {
    this.selectedSponsor.set(null);
  }

  onCollaboratorsLoaded(collaborators: Sponsor[]): void {
    this.collaboratorsCount.set(collaborators.length);
    this.collaboratorsLoaded.set(true);
  }
}
