import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TacticalSharedModule } from '../../core/modules';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  peopleOutline, 
  trophyOutline
} from 'ionicons/icons';

export interface Team {
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
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
  standalone: true,
  imports: [
    TacticalSharedModule
  ]
})
export class TeamCardComponent {
  @Input() team!: Team;
  @Input() isLoading: boolean = false;
  
  @Output() joinTeam = new EventEmitter<Team>();

  constructor() {
    addIcons({ 
      locationOutline, 
      peopleOutline, 
      trophyOutline
    });
  }

  onJoinTeam() {
    this.joinTeam.emit(this.team);
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
}