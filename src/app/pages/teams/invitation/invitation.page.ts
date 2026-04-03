import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { ViewWillEnter } from '@ionic/angular';
import { 
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
  IonAvatar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  checkmarkCircle,
  closeCircle,
  peopleOutline,
  locationOutline
} from 'ionicons/icons';

interface ClubInvitation {
  clubId: string;
  clubName: string;
  clubLocation: string;
  clubImageUrl: string;
  membersCount: number;
  description: string;
  invitedBy: string;
}

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.page.html',
  styleUrls: ['./invitation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
    IonAvatar
  ]
})
export class InvitationPage implements OnInit, ViewWillEnter {
  invitationUuid: string = '';
  invitation: ClubInvitation | null = null;
  isLoading = true;
  isAccepting = false;
  error: string | null = null;

  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    addIcons({
      'checkmark-circle': checkmarkCircle,
      'close-circle': closeCircle,
      'people-outline': peopleOutline,
      'location-outline': locationOutline
    });
  }

  ngOnInit() {
    // Get UUID from route params
    this.route.params.subscribe(params => {
      this.invitationUuid = params['uuid'];
      this.loadInvitation();
    });
  }

  ionViewWillEnter() {
    // Reset states when entering the page
    this.isAccepting = false;
    this.error = null;
  }

  async loadInvitation() {
    this.isLoading = true;
    this.error = null;

    try {
      // Simulate API call to fetch invitation details
      await this.delay(1000);
      
      // Mock invitation data - In real app, fetch from API using UUID
      this.invitation = {
        clubId: '1',
        clubName: 'Barcelona FC Academy',
        clubLocation: 'Barcelona, Spain',
        clubImageUrl: 'https://via.placeholder.com/120x120?text=BAR',
        membersCount: 45,
        description: 'Elite football training academy focusing on technical skills and tactical awareness.',
        invitedBy: 'Coach Martinez'
      };
    } catch (error) {
      this.error = 'Unable to load invitation. The link may be invalid or expired.';
    } finally {
      this.isLoading = false;
    }
  }

  async acceptInvitation() {
    if (!this.invitation) return;

    this.isAccepting = true;

    try {
      // Simulate API call to accept invitation
      await this.delay(1500);
      
      // Navigate to player registration with club context
      this.navigationService.navigateTo(['/player-register'], {
        queryParams: {
          clubId: this.invitation.clubId,
          invitationId: this.invitationUuid
        }
      });
    } catch (error) {
      this.error = 'Failed to accept invitation. Please try again.';
      this.isAccepting = false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
