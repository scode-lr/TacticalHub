import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { addIcons } from 'ionicons';
import { 
  chevronDownOutline,
  closeOutline,
  locationOutline,
  arrowBackOutline,
  searchOutline
} from 'ionicons/icons';

export interface Organization {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
}

interface MinimalTeam {
  organizationId: string;
}

@Component({
  selector: 'app-team-selector',
  templateUrl: './team-selector.component.html',
  styleUrls: ['./team-selector.component.scss'],
  standalone: true,
  imports: [SHARED_IMPORTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TeamSelectorComponent {
  @Input() currentTeam: Organization | MinimalTeam | null = null;
  @Input() organizations: Organization[] = [];
  @Output() clubSelected = new EventEmitter<Organization>();

  isModalOpen = false;
  constructor() {
    addIcons({
      chevronDownOutline,
      closeOutline,
      locationOutline
    });
  }

  openTeamSelector() {
    this.isModalOpen = true;
  }

  closeTeamSelector() {
    this.isModalOpen = false;
  }

  selectClub(club: Organization) {
    this.clubSelected.emit(club);
    this.closeTeamSelector();
  }



  isOrganization(team: Organization | MinimalTeam | null): team is Organization {
    return team !== null && 'name' in team && 'imageUrl' in team;
  }

  getTeamId(team: Organization | MinimalTeam | null): string | undefined {
    if (!team) return undefined;
    return this.isOrganization(team) ? team.id : team.organizationId;
  }

  getTeamName(team: Organization | MinimalTeam | null): string {
    if (!team) return 'TacticalHub';
    return this.isOrganization(team) ? team.name : 'TacticalHub';
  }

  getTeamImage(team: Organization | MinimalTeam | null): string {
    if (!team) return 'assets/image-non-available.svg';
    return this.isOrganization(team) ? (team.imageUrl || 'assets/image-non-available.svg') : 'assets/image-non-available.svg';
  }
}