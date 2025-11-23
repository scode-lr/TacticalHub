import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { UserHeaderComponent } from '@components/user-header/user-header.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonSelect,
    IonSelectOption,
    TranslatePipe,
    UserHeaderComponent
  ]
})
export class SettingsPage {
  private readonly translationService = inject(TranslationService);
  private readonly navigationService = inject(NavigationService);

  readonly currentLanguage = signal<string>('en');
  readonly supportedLanguages = signal<Array<{ code: string; name: string }>>([]);

  ngOnInit() {
    this.currentLanguage.set(this.translationService.getCurrentLanguage());
    this.loadSupportedLanguages();
  }

  loadSupportedLanguages() {
    const languages = this.translationService.getSupportedLanguages();
    const languageNames: Record<string, string> = {
      'en': 'settings.english',
      'es': 'settings.spanish',
      'ca': 'settings.catalan'
    };

    this.supportedLanguages.set(
      languages.map(code => ({
        code,
        name: languageNames[code] || code
      }))
    );
  }

  onLanguageChange(event: any) {
    const newLanguage = event.detail.value;
    this.translationService.setLanguage(newLanguage, true);
    this.currentLanguage.set(newLanguage);
  }

  goBack() {
    this.navigationService.goBack();
  }
}
