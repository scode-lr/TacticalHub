import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslationService } from '@services/i18n/translation.service';
import { UserService } from '@services/user.service';
import { environment } from '@environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly translationService = inject(TranslationService);
  private readonly userService = inject(UserService);

  async ngOnInit() {
    await this.translationService.initialize({
      translations: environment.translations,
      supportedLanguages: environment.supportedLanguages,
      defaultLanguage: environment.defaultLanguage
    });

    await this.refreshUserData();
  }

  private async refreshUserData(): Promise<void> {
    await this.userService.fetchUserProfile();    
  }
}
