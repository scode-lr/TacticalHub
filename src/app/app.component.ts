import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslationService } from '@services/i18n/translation.service';
import { environment } from '@environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private translationService: TranslationService) {}

  async ngOnInit() {
    await this.translationService.initialize({
      translations: environment.translations,
      supportedLanguages: environment.supportedLanguages,
      defaultLanguage: environment.defaultLanguage
    });
  }
}
