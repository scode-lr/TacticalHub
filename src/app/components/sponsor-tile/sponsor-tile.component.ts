import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sponsor } from '@core/models/sponsor.model';
import { DefaultImageDirective } from '@core/directives';

@Component({
  selector: 'app-sponsor-tile',
  templateUrl: './sponsor-tile.component.html',
  styleUrls: ['./sponsor-tile.component.scss'],
  standalone: true,
  imports: [CommonModule, DefaultImageDirective]
})
export class SponsorTileComponent {
  readonly sponsor = input.required<Sponsor>();
  readonly showName = input<boolean>(true);

  readonly sponsorSelected = output<Sponsor>();

  onSelect(): void {
    this.sponsorSelected.emit(this.sponsor());
  }
}
