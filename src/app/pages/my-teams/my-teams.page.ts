import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TacticalSharedModule } from '../../core/modules';
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
import { Organization } from '../../components/team-selector/team-selector.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  role: 'Captain' | 'Vice-Captain' | 'Player';
  imageUrl: string;
}

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.page.html',
  styleUrls: ['./my-teams.page.scss'],
  standalone: true,
  imports: [TacticalSharedModule, SideMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyTeamsPage {
  organizations: Organization[] = [];
  currentOrg: Organization | null = null;
  players: Player[] = [];

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
    this.organizations = [
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
    ];

    // Mock players data
    this.players = [
      {
        id: '1',
        name: 'Carlos Martinez',
        position: 'Forward',
        number: 10,
        age: 19,
        role: 'Captain',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpg'
      },
      {
        id: '2',
        name: 'David Silva',
        position: 'Midfielder',
        number: 8,
        age: 20,
        role: 'Vice-Captain',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpg'
      },
      {
        id: '3',
        name: 'Alex Rodriguez',
        position: 'Defender',
        number: 4,
        age: 18,
        role: 'Player',
        imageUrl: 'https://picsvg.com/svg/5ho8PQ.jpg'
      }
    ];
  }

  onClubSelected(club: Organization) {
    this.currentOrg = club;
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
}