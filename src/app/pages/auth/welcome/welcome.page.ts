import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonButton,
  IonIcon,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  shieldCheckmarkOutline,
  logInOutline,
  personAddOutline
} from 'ionicons/icons';
import { environment } from '../../../../environments/environment';
import { TranslationService } from '../../../core/services/i18n/translation.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonText
  ]
})
export class WelcomePage implements OnInit {
  appName = environment.projectName;
  tagline = '';
  
  constructor(
    private router: Router,
    private translationService: TranslationService
  ) {
    addIcons({
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'log-in-outline': logInOutline,
      'person-add-outline': personAddOutline
    });
  }

  ngOnInit() {
    // Initialize translations
    this.translationService.setTranslations(environment.translations);
    // Get translated tagline
    this.tagline = this.translationService.t(environment.taglineKey);
  }

  navigateToSignIn() {
    this.router.navigate(['/signin']);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  // Helper method to get translation (can be used in template)
  t(key: string): string {
    return this.translationService.t(key);
  }
}
