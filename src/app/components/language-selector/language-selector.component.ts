import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { TranslationService } from '@services/i18n/translation.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton]
})
export class LanguageSelectorComponent {
  languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ca', name: 'Català', flag: '🏴' }
  ];

  constructor(public translationService: TranslationService) {}

  get currentLanguage(): string {
    return this.translationService.getCurrentLanguage();
  }

  get supportedLanguages(): string[] {
    return this.translationService.getSupportedLanguages();
  }

  get availableLanguages() {
    return this.languages.filter(lang => 
      this.supportedLanguages.includes(lang.code)
    );
  }

  changeLanguage(langCode: string): void {
    this.translationService.setLanguage(langCode);
    window.location.reload();
  }

  getLanguageName(code: string): string {
    const lang = this.languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  }
}
