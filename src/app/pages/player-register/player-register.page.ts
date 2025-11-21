import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { CommonModule } from '@angular/common';
import { 
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonText,
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  person, 
  mail, 
  call, 
  calendar, 
  location, 
  shirt, 
  fitness,
  trophy,
  football,
  arrowBack,
  checkmarkCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-player-register',
  templateUrl: './player-register.page.html',
  styleUrls: ['./player-register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonText,
    IonSpinner,
    IonToast
  ]
})
export class PlayerRegisterPage implements OnInit {
  playerForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  
  // Club context from invitation
  clubId: string | null = null;
  invitationId: string | null = null;
  
  // Options for dropdowns
  positions = [
    { value: 'goalkeeper', label: 'Goalkeeper' },
    { value: 'defender', label: 'Defender' },
    { value: 'midfielder', label: 'Midfielder' },
    { value: 'forward', label: 'Forward' }
  ];
  
  preferredFoot = [
    { value: 'right', label: 'Right' },
    { value: 'left', label: 'Left' },
    { value: 'both', label: 'Both' }
  ];
  
  experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'professional', label: 'Professional' }
  ];

  private readonly formBuilder = inject(FormBuilder);
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    addIcons({ 
      person, 
      mail, 
      call, 
      calendar, 
      location, 
      shirt, 
      fitness,
      trophy,
      football,
      arrowBack,
      checkmarkCircle
    });
    
    this.playerForm = this.formBuilder.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      dateOfBirth: ['', Validators.required],
      
      // Location
      city: ['', Validators.required],
      country: ['', Validators.required],
      
      // Player Details
      position: ['', Validators.required],
      preferredFoot: ['', Validators.required],
      jerseyNumber: ['', [Validators.min(1), Validators.max(99)]],
      
      // Experience
      experienceLevel: ['', Validators.required],
      yearsPlaying: ['', [Validators.min(0), Validators.max(50)]],
      
      // Additional Info
      bio: ['', [Validators.maxLength(500)]],
      achievements: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    // Check for club context from invitation
    this.route.queryParams.subscribe(params => {
      this.clubId = params['clubId'] || null;
      this.invitationId = params['invitationId'] || null;
      
      if (this.clubId && this.invitationId) {
        console.log('Registering player for club:', this.clubId, 'via invitation:', this.invitationId);
      }
    });
  }

  goBack() {
    // If coming from invitation, go back to invitation page
    if (this.invitationId) {
      this.navigationService.navigateTo(['/invitation', this.invitationId]);
    } else {
      this.navigationService.navigateTo(['/app/my-teams']);
    }
  }

  async onSubmit() {
    if (this.playerForm.valid) {
      this.isLoading = true;
      
      try {
        // Simulate API call
        await this.simulateRegistration();
        
        this.showToastMessage('Player registered successfully!', 'success');
        
        setTimeout(() => {
          // If coming from invitation, redirect to app home
          // Otherwise, redirect to my-teams
          if (this.clubId && this.invitationId) {
            this.navigationService.navigateTo(['/app/dashboard']);
          } else {
            this.navigationService.navigateTo(['/app/my-teams']);
          }
        }, 1500);
        
      } catch (error) {
        this.showToastMessage('Registration failed. Please try again.', 'danger');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
      this.showToastMessage('Please fill in all required fields', 'warning');
    }
  }

  private async simulateRegistration(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registrationData = {
          ...this.playerForm.value,
          clubId: this.clubId,
          invitationId: this.invitationId
        };
        console.log('Player Data:', registrationData);
        resolve();
      }, 2000);
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.playerForm.controls).forEach(key => {
      const control = this.playerForm.get(key);
      control?.markAsTouched();
    });
  }

  private showToastMessage(message: string, color: string = 'success') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  // Getters for form controls
  get firstName() { return this.playerForm.get('firstName'); }
  get lastName() { return this.playerForm.get('lastName'); }
  get email() { return this.playerForm.get('email'); }
  get phone() { return this.playerForm.get('phone'); }
  get dateOfBirth() { return this.playerForm.get('dateOfBirth'); }
  get city() { return this.playerForm.get('city'); }
  get country() { return this.playerForm.get('country'); }
  get position() { return this.playerForm.get('position'); }
  get preferredFootControl() { return this.playerForm.get('preferredFoot'); }
  get experienceLevel() { return this.playerForm.get('experienceLevel'); }
}
