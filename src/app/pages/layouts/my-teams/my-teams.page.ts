import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline,
  peopleOutline,
  searchOutline,
  calendarOutline,
  trophyOutline,
  settingsOutline,
  locationOutline,
  personAddOutline,
  arrowBackOutline,
  shirtOutline,
  people
} from 'ionicons/icons';
import { Organization } from '../../../components/team-selector/team-selector.component';

interface TrainingNote {
  date: string;
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor';
  notes: string;
  attended: boolean;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  role: 'Captain' | 'Vice-Captain' | 'Player';
  imageUrl: string;
  trainingNotes: TrainingNote[];
}

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.page.html',
  styleUrls: ['./my-teams.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonChip
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyTeamsPage {
  organizations = signal<Organization[]>([]);
  currentOrg = signal<Organization | null>(null);
  players = signal<Player[]>([]);
  expandedPlayerId = signal<string | null>(null);

  togglePlayerDetails(playerId: string) {
    this.expandedPlayerId.set(this.expandedPlayerId() === playerId ? null : playerId);
  }

  isPlayerExpanded(playerId: string): boolean {
    return this.expandedPlayerId() === playerId;
  }
  
  // Group players by position
  groupedPlayers() {
    const players = this.players();
    const grouped = players.reduce((acc, player) => {
      if (!acc[player.position]) {
        acc[player.position] = [];
      }
      acc[player.position].push(player);
      return acc;
    }, {} as Record<string, Player[]>);

    // Sort positions in preferred order
    const positionOrder = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
    return positionOrder
      .filter(pos => grouped[pos]?.length > 0)
      .map(position => ({
        position,
        players: grouped[position].sort((a, b) => a.number - b.number)
      }));
  }

  constructor() {
    this.initializeIcons();
    this.loadMockData();
    
    // Listen for club selection from side menu
    window.addEventListener('clubSelected', ((event: CustomEvent) => {
      this.onClubSelected(event.detail);
    }) as EventListener);
  }

  private initializeIcons() {
    addIcons({ 
      homeOutline,
      peopleOutline,
      searchOutline,
      calendarOutline,
      trophyOutline,
      settingsOutline,
      locationOutline,
      personAddOutline,
      arrowBackOutline,
      shirtOutline,
      people
    });
  }

  private loadMockData() {
    this.organizations.set([
      {
        id: '1',
        name: 'Barcelona FC',
        location: 'Barcelona, Spain',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpgt=BAR'
      },
      {
        id: '2',
        name: 'Manchester United',
        location: 'Manchester, UK',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpgt=MAN'
      },
      {
        id: '3',
        name: 'Real Madrid',
        location: 'Madrid, Spain',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpgt=RMA'
      },
      {
        id: '4',
        name: 'Bayern Munich',
        location: 'Munich, Germany',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpgt=BAY'
      }
    ]);

    // Mock players data
    this.players.set([
      {
        id: '1',
        name: 'Carlos Martinez',
        position: 'Forward',
        number: 10,
        age: 19,
        role: 'Captain',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpg',
        trainingNotes: [
          {
            date: '2025-10-06',
            performance: 'Excellent',
            notes: 'Great finishing practice, showed leadership in team drills',
            attended: true
          },
          {
            date: '2025-10-03',
            performance: 'Good',
            notes: 'Good movement off the ball, needs to improve first touch',
            attended: true
          },
          {
            date: '2025-10-01',
            performance: 'Average',
            notes: 'Seemed tired, participation was limited',
            attended: true
          }
        ]
      },
      {
        id: '2',
        name: 'David Silva',
        position: 'Midfielder',
        number: 8,
        age: 20,
        role: 'Vice-Captain',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpg',
        trainingNotes: [
          {
            date: '2025-10-06',
            performance: 'Good',
            notes: 'Strong passing drills, good communication',
            attended: true
          },
          {
            date: '2025-10-03',
            performance: 'Excellent',
            notes: 'Outstanding performance in tactical exercises',
            attended: true
          },
          {
            date: '2025-10-01',
            attended: false,
            performance: 'Poor',
            notes: 'Absent due to minor injury'
          }
        ]
      },
      {
        id: '3',
        name: 'Alex Rodriguez',
        position: 'Defender',
        number: 4,
        age: 18,
        role: 'Player',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpg',
        trainingNotes: [
          {
            date: '2025-10-06',
            performance: 'Good',
            notes: 'Solid defensive positioning, good tackles',
            attended: true
          },
          {
            date: '2025-10-03',
            performance: 'Good',
            notes: 'Improving aerial ability, good marking',
            attended: true
          },
          {
            date: '2025-10-01',
            performance: 'Excellent',
            notes: 'Exceptional performance in defensive drills',
            attended: true
          }
        ]
      }
    ]);
  }

  onClubSelected(club: Organization) {
    this.currentOrg.set(club);
    // In a real app, you would load the players for this club's main team
    // TODO: Call the club service to load players
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'captain':
        return 'danger';
      case 'vice-captain':
        return 'warning';
      default:
        return 'medium';
    }
  }

  getPerformanceColor(performance: string): string {
    switch (performance.toLowerCase()) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'primary';
      case 'average':
        return 'warning';
      case 'poor':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getWeekDays(player: Player) {
    const today = new Date();
    const days = [];
    
    // Get Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    
    // Create array of week days
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dayStr = date.toISOString().split('T')[0];
      
      days.push({
        date: date,
        dayNumber: date.getDate(),
        shortName: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        note: player.trainingNotes.find(note => note.date === dayStr)
      });
    }
    
    return days;
  }

  getSelectedDayNote(player: Player): TrainingNote | undefined {
    const today = new Date().toISOString().split('T')[0];
    return player.trainingNotes.find(note => note.date === today);
  }

  getPerformanceBackground(performance: string): string {
    switch (performance.toLowerCase()) {
      case 'excellent':
        return 'var(--ion-color-success-tint)';
      case 'good':
        return 'var(--ion-color-primary-tint)';
      case 'average':
        return 'var(--ion-color-warning-tint)';
      case 'poor':
        return 'var(--ion-color-danger-tint)';
      default:
        return 'var(--ion-color-medium-tint)';
    }
  }
}