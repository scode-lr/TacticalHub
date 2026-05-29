import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Sponsor, SPONSOR_INFO_KEYS } from '@core/models/sponsor.model';
import { addIcons } from 'ionicons';
import { linkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sponsor-detail',
  templateUrl: './sponsor-detail.component.html',
  styleUrls: ['./sponsor-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class SponsorDetailComponent {
  readonly sponsor = input.required<Sponsor>();
  readonly compact = input(false);

  private readonly infoKeys = SPONSOR_INFO_KEYS;

  constructor() {
    addIcons({ linkOutline });
  }

  infoKeyLabel(key: string): string {
    return this.infoKeys.find(k => k.value === key)?.label ?? '';
  }

  isInfoLink(key: string): boolean {
    const k = key.toLowerCase();
    return k !== 'email' && k !== 'mobile';
  }
}
