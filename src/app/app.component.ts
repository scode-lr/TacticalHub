import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  private readonly titleService = inject(Title);

  async ngOnInit() {
    this.titleService.setTitle(environment.name);

    await this.translationService.initialize({
      translations: environment.translations,
      supportedLanguages: environment.supportedLanguages,
      defaultLanguage: environment.defaultLanguage
    });

    await this.refreshUserData();
  }

  private async refreshUserData(): Promise<void> {
    const storedUser = this.userService.getStoredUser();

    if (!storedUser || storedUser.isGuest || !this.userService.isAuthenticated()) {
      return;
    }

    await this.userService.fetchUserProfile();    
  }
}
