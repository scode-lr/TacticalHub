import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Sponsor, AdditionalInfo, SPONSOR_INFO_KEYS } from '@core/models/sponsor.model';
import { DefaultImageDirective } from '@core/directives';
import { addIcons } from 'ionicons';
import {
  linkOutline, globeOutline, mailOutline, callOutline,
  logoInstagram, logoTwitter, logoFacebook, logoTiktok,
  logoYoutube, logoLinkedin, logoTwitch
} from 'ionicons/icons';

@Component({
  selector: 'app-sponsor-detail',
  templateUrl: './sponsor-detail.component.html',
  styleUrls: ['./sponsor-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, DefaultImageDirective]
})
export class SponsorDetailComponent {
  readonly sponsor = input.required<Sponsor>();

  private readonly infoKeys = SPONSOR_INFO_KEYS;

  private readonly iconByKey: Record<string, string> = {
    website: 'globe-outline',
    instagram: 'logo-instagram',
    twitter: 'logo-twitter',
    facebook: 'logo-facebook',
    tiktok: 'logo-tiktok',
    youtube: 'logo-youtube',
    linkedin: 'logo-linkedin',
    twitch: 'logo-twitch',
    email: 'mail-outline',
    mobile: 'call-outline',
  };

  constructor() {
    addIcons({
      linkOutline, globeOutline, mailOutline, callOutline,
      logoInstagram, logoTwitter, logoFacebook, logoTiktok,
      logoYoutube, logoLinkedin, logoTwitch
    });
  }

  infoKeyLabel(key: string): string {
    return this.infoKeys.find(k => k.value === key)?.label ?? '';
  }

  infoIcon(key: string): string {
    return this.iconByKey[key.toLowerCase()] ?? 'link-outline';
  }

  /** Email/Mobile resolve to in-app actions; everything else is an external link. */
  isExternal(key: string): boolean {
    const k = key.toLowerCase();
    return k !== 'email' && k !== 'mobile';
  }

  infoHref(info: AdditionalInfo): string {
    const k = info.key.toLowerCase();
    const value = info.value.trim();
    if (k === 'email') return `mailto:${value}`;
    if (k === 'mobile') return `tel:${value}`;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  }
}
