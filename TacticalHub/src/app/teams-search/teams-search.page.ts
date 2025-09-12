import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonSearchbar,
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonButton, 
  IonIcon,
  IonText,
  IonSpinner,
  IonToast,
  IonAvatar,
  IonChip,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  search, 
  locationOutline, 
  peopleOutline, 
  trophyOutline, 
  addOutline,
  refreshOutline
} from 'ionicons/icons';

interface Team {
  id: string;
  name: string;
  location: string;
  membersCount: number;
  level: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  joinRequests?: number;
}

@Component({
  selector: 'app-teams-search',
  templateUrl: './teams-search.page.html',
  styleUrls: ['./teams-search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner,
    IonToast,
    IonAvatar,
    IonChip,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonRefresher,
    IonRefresherContent
  ]
})
export class TeamsSearchPage implements OnInit {
  searchTerm = '';
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  isLoading = false;
  showToast = false;
  toastMessage = '';

  constructor(private router: Router) {
    addIcons({ 
      search, 
      locationOutline, 
      peopleOutline, 
      trophyOutline, 
      addOutline,
      refreshOutline
    });
  }

  ngOnInit() {
    this.loadTeams();
  }

  async loadTeams() {
    this.isLoading = true;
    
    // Simulate API call to load teams
    setTimeout(() => {
      this.teams = this.getMockTeams();
      this.filteredTeams = [...this.teams];
      this.isLoading = false;
    }, 1500);
  }

  onSearchChange(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    this.searchTerm = searchTerm;
    
    if (searchTerm.trim() === '') {
      this.filteredTeams = [...this.teams];
    } else {
      this.filteredTeams = this.teams.filter(team => 
        team.name.toLowerCase().includes(searchTerm) ||
        team.location.toLowerCase().includes(searchTerm) ||
        team.level.toLowerCase().includes(searchTerm)
      );
    }
  }

  async joinTeam(team: Team) {
    this.isLoading = true;
    
    // Simulate joining a team
    setTimeout(() => {
      this.isLoading = false;
      this.showToastMessage(`Request sent to join ${team.name}!`);
      
      // Navigate to home/dashboard after successful join
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    }, 1000);
  }

  async refreshTeams(event: any) {
    await this.loadTeams();
    event.target.complete();
  }

  createNewTeam() {
    this.showToastMessage('Create team feature coming soon!');
  }

  private getMockTeams(): Team[] {
    return [
      {
        id: '1',
        name: 'Barcelona FC Academy',
        location: 'Barcelona, Spain',
        membersCount: 25,
        level: 'Professional',
        description: 'Elite football training academy focusing on technical skills and tactical awareness.',
        imageUrl: 'https://via.placeholder.com/60x60?text=BAR',
        isPublic: true,
        joinRequests: 5
      },
      {
        id: '2',
        name: 'Manchester United Youth',
        location: 'Manchester, UK',
        membersCount: 18,
        level: 'Semi-Professional',
        description: 'Youth development program for aspiring football players aged 16-21.',
        imageUrl: 'https://via.placeholder.com/60x60?text=MAN',
        isPublic: true,
        joinRequests: 12
      },
      {
        id: '3',
        name: 'Local Lions FC',
        location: 'Madrid, Spain',
        membersCount: 32,
        level: 'Amateur',
        description: 'Community football club welcoming players of all skill levels.',
        imageUrl: 'https://via.placeholder.com/60x60?text=LIO',
        isPublic: true,
        joinRequests: 3
      },
      {
        id: '4',
        name: 'Bayern Munich Reserves',
        location: 'Munich, Germany',
        membersCount: 22,
        level: 'Professional',
        description: 'Reserve team for Bayern Munich with focus on advanced tactics.',
        imageUrl: 'https://via.placeholder.com/60x60?text=BAY',
        isPublic: false,
        joinRequests: 8
      },
      {
        id: '5',
        name: 'Paris Saint-Germain Youth',
        location: 'Paris, France',
        membersCount: 28,
        level: 'Semi-Professional',
        description: 'Youth academy known for developing world-class talent.',
        imageUrl: 'https://via.placeholder.com/60x60?text=PSG',
        isPublic: true,
        joinRequests: 15
      },
      {
        id: '6',
        name: 'Chelsea FC Academy',
        location: 'London, UK',
        membersCount: 20,
        level: 'Professional',
        description: 'Premier League academy with emphasis on physical and mental development.',
        imageUrl: 'https://via.placeholder.com/60x60?text=CHE',
        isPublic: false,
        joinRequests: 7
      }
    ];
  }

  getLevelColor(level: string): string {
    switch (level.toLowerCase()) {
      case 'professional':
        return 'danger';
      case 'semi-professional':
        return 'warning';
      case 'amateur':
        return 'success';
      default:
        return 'medium';
    }
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }
}