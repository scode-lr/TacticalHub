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
  logInOutline,
  personAddOutline
} from 'ionicons/icons';
import { environment } from '@environment';
import { TranslationService } from '@services/i18n/translation.service';
import { AuthBrandingComponent } from '@components/auth-branding/auth-branding.component';
import { TranslatePipe } from '@pipes/index';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonText,
    AuthBrandingComponent,
    TranslatePipe
  ]
})
export class WelcomePage implements OnInit {
  appName = environment.name;
  tagline = '';
  
  constructor(
    private router: Router,
    private translationService: TranslationService
  ) {
    addIcons({
      'log-in-outline': logInOutline,
      'person-add-outline': personAddOutline
    });
  }

  ngOnInit() {
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
