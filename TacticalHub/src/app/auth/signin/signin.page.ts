import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonText,
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logoApple, mail, lockClosed, person } from 'ionicons/icons';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner,
    IonToast
  ]
})
export class SigninPage implements OnInit {
  signinForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    addIcons({ logoGoogle, logoApple, mail, lockClosed, person });
    
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onSignIn() {
    if (this.signinForm.valid) {
      this.isLoading = true;
      
      // Simulate authentication
      setTimeout(() => {
        this.isLoading = false;
        this.showToastMessage('Sign in successful!');
        
        // Navigate to teams search or home based on user's club status
        // For now, navigate to teams search
        this.router.navigate(['/teams-search']);
      }, 2000);
    } else {
      this.showToastMessage('Please fill in all required fields correctly.');
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    // Implement Google Sign-In logic here
    setTimeout(() => {
      this.isLoading = false;
      this.showToastMessage('Google Sign-In not implemented yet');
    }, 1000);
  }

  async signInWithApple() {
    this.isLoading = true;
    // Implement Apple Sign-In logic here
    setTimeout(() => {
      this.isLoading = false;
      this.showToastMessage('Apple Sign-In not implemented yet');
    }, 1000);
  }

  navigateToSignUp() {
    this.router.navigate(['/auth/signup']);
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }
}