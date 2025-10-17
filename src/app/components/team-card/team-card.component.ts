import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonAvatar,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  peopleOutline, 
  trophyOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  shieldOutline
} from 'ionicons/icons';

export interface Team {
  id: string;
  name: string;
  location: string;
  membersCount: number;
  level: string;
  description: string;
  imageUrl: string;
  teamsCount?: number;
  isRequested?: boolean;
}

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonAvatar,
    IonChip
  ]
})
export class TeamCardComponent {
  @Input() team!: Team;
  
  @Output() joinTeam = new EventEmitter<Team>();

  constructor() {
    addIcons({ 
      locationOutline, 
      peopleOutline, 
      trophyOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      shieldOutline
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