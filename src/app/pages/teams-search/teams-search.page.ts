import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { TeamCardComponent, type Team } from '../../components';
import { addIcons } from 'ionicons';
import { 
  search, 
  addOutline,
  refreshOutline,
  arrowForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-teams-search',
  templateUrl: './teams-search.page.html',
  styleUrls: ['./teams-search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSpinner,
    IonToast,
    IonGrid,
    IonRow,
    IonCol,
    IonRefresher,
    IonRefresherContent,
    TeamCardComponent
  ]
})
export class TeamsSearchPage implements OnInit {
  searchTerm = '';
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  isLoading = false;
  showToast = false;
  toastMessage = '';
  requestedTeams: Set<string> = new Set();

  get hasRequestedTeams(): boolean {
    return this.requestedTeams.size > 0;
  }

  get requestedTeamsCount(): number {
    return this.requestedTeams.size;
  }

  constructor(private router: Router) {
    addIcons({ 
      search, 
      addOutline,
      refreshOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() {
    this.teams = this.getMockTeams();
  }

  onSearchChange(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    this.searchTerm = searchTerm;
    
    if (searchTerm.trim() === '') {
      this.filteredTeams = [];
    } else {
      this.isLoading = true;
      
      setTimeout(() => {
        this.filteredTeams = this.teams.filter(team => 
          team.name.toLowerCase().includes(searchTerm) ||
          team.location.toLowerCase().includes(searchTerm) ||
          team.level.toLowerCase().includes(searchTerm)
        );
        this.isLoading = false;
      }, 500);
    }
  }

  async joinTeam(team: Team) {
    if (team.isRequested) return;
    
    this.requestedTeams.add(team.id);
    
    const updateTeam = (t: Team) => {
      if (t.id === team.id) {
        t.isRequested = true;
      }
      return t;
    };
    
    this.teams = this.teams.map(updateTeam);
    this.filteredTeams = this.filteredTeams.map(updateTeam);
    
    this.showToastMessage(`Request sent to join ${team.name}!`);
    
    // Navigate to my-teams page after joining
    setTimeout(() => {
      this.router.navigate(['/app/my-teams']);
    }, 1500); // Wait for the toast to be visible
  }

  continueToHome() {
    this.router.navigate(['/app/dashboard']);
  }

  async refreshTeams(event: any) {
    this.teams = this.getMockTeams();
    
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.filteredTeams = this.teams.filter(team => 
        team.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        team.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        team.level.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredTeams = [];
    }
    
    event.target.complete();
  }

  createNewTeam() {
    this.showToastMessage('Create team feature coming soon!');
  }

  skipSearch() {
    this.router.navigate(['/app/dashboard']);
  }

  private getMockTeams(): Team[] {
    return [
      {
        id: '1',
        name: 'Barcelona FC Academy',
        location: 'Barcelona, Spain',
        membersCount: 25,
        level: 'Professional',
        description: 'Elite football training academy focusing on technical skills and tactical awareness. We offer comprehensive training programs for players looking to reach the highest level of football.',
        imageUrl: 'https://via.placeholder.com/60x60?text=BAR',
        teamsCount: 4,
        isRequested: false
      },
      {
        id: '2',
        name: 'Manchester United Youth',
        location: 'Manchester, UK',
        membersCount: 18,
        level: 'Semi-Professional',
        description: 'Youth development program for aspiring football players aged 16-21. Our program includes technical training, physical conditioning, and mental preparation.',
        imageUrl: 'https://via.placeholder.com/60x60?text=MAN',
        teamsCount: 3,
        isRequested: false
      },
      {
        id: '3',
        name: 'Local Lions FC',
        location: 'Madrid, Spain',
        membersCount: 32,
        level: 'Amateur',
        description: 'Community football club welcoming players of all skill levels. We focus on fun, friendship, and development in a supportive environment.',
        imageUrl: 'https://via.placeholder.com/60x60?text=LIO',
        teamsCount: 2,
        isRequested: false
      },
      {
        id: '4',
        name: 'Bayern Munich Reserves',
        location: 'Munich, Germany',
        membersCount: 22,
        level: 'Professional',
        description: 'Reserve team for Bayern Munich with focus on advanced tactics. Players train with professional coaches and compete at the highest level.',
        imageUrl: 'https://via.placeholder.com/60x60?text=BAY',
        teamsCount: 6,
        isRequested: false
      },
      {
        id: '5',
        name: 'Paris Saint-Germain Youth',
        location: 'Paris, France',
        membersCount: 28,
        level: 'Semi-Professional',
        description: 'Youth academy known for developing world-class talent. Our comprehensive program covers all aspects of modern football development.',
        imageUrl: 'https://via.placeholder.com/60x60?text=PSG',
        teamsCount: 5,
        isRequested: false
      },
      {
        id: '6',
        name: 'Chelsea FC Academy',
        location: 'London, UK',
        membersCount: 20,
        level: 'Professional',
        description: 'Premier League academy with emphasis on physical and mental development. We prepare players for the demands of professional football.',
        imageUrl: 'https://via.placeholder.com/60x60?text=CHE',
        teamsCount: 3,
        isRequested: false
      }
    ];
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }
}
