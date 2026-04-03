import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';

@Component({
  selector: 'app-auth-branding',
  templateUrl: './auth-branding.component.html',
  styleUrls: ['./auth-branding.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class AuthBrandingComponent implements OnInit {
  appName = environment.name;
  tagline = '';

  constructor(private translationService: TranslationService) {
  }

  ngOnInit() {
    this.tagline = this.translationService.instant(environment.taglineKey);
  }
}
