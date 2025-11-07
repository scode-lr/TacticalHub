import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthBrandingComponent } from '../../../components/auth-branding/auth-branding.component';
import { MockAuthService } from '../../../core/services/mock-auth.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    IonIcon,
    AuthBrandingComponent
  ]
})
export class LoadingPage implements OnInit {
  loadingMessage = 'Signing you in...';
  loadingSubMessage = 'Please wait while we prepare everything';
  showSteps = true;
  currentStep = 1;

  constructor(
    private router: Router,
    private mockAuthService: MockAuthService
  ) {}

  ngOnInit() {
    this.simulateLoadingSteps();
  }

  private simulateLoadingSteps() {
    // Step 1: Authenticating
    setTimeout(() => {
      this.currentStep = 2;
      this.loadingMessage = 'Loading your profile...';
    }, 800);

    // Step 2: Loading profile
    setTimeout(() => {
      this.currentStep = 3;
      this.loadingMessage = 'Preparing workspace...';
    }, 1600);

    // Step 3: Complete and navigate
    setTimeout(() => {
      this.loadingMessage = 'All set!';
      this.loadingSubMessage = 'Redirecting...';
      
      // Navigate to role selection
      setTimeout(() => {
        this.router.navigate(['/auth/role-selection']);
      }, 500);
    }, 2400);
  }
}
