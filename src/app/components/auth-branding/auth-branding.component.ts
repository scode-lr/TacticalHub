import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';

@Component({
  selector: 'app-auth-branding',
  templateUrl: './auth-branding.component.html',
  styleUrls: ['./auth-branding.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon
  ]
})
export class AuthBrandingComponent implements OnInit {
  appName = environment.name;
  tagline = '';

  constructor(private translationService: TranslationService) {
    addIcons({
      'shield-checkmark-outline': shieldCheckmarkOutline
    });
  }

  ngOnInit() {
    this.tagline = this.translationService.t(environment.taglineKey);
  }
}
