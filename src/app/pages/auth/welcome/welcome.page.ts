import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { AuthBrandingComponent } from '../components';
import { TranslatePipe } from '@pipes/translate.pipe';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss', '../auth-shared.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AuthBrandingComponent,
    TranslatePipe
  ]
})
export class WelcomePage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly translationService = inject(TranslationService);

  appName = environment.name;
  tagline = '';

  ngOnInit() {
    this.tagline = this.translationService.instant(environment.taglineKey);
  }

  navigateToSignIn() {
    this.navigationService.navigateTo(['/auth/signin']);
  }

  navigateToSignUp() {
    this.navigationService.navigateTo(['/auth/signup']);
  }

  // Helper method to get translation (can be used in template)
  t(key: string): string {
    return this.translationService.instant(key);
  }
}
