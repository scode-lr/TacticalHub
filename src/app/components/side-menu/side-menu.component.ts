import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { addIcons } from 'ionicons';
import { 
  homeOutline,
  peopleOutline,
  searchOutline,
  calendarOutline,
  trophyOutline,
  settingsOutline
} from 'ionicons/icons';
import { Organization } from '../team-selector/team-selector.component';
import { TeamSelectorComponent } from '../team-selector/team-selector.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [SHARED_IMPORTS, TeamSelectorComponent]
})
export class SideMenuComponent {
  @Input() showTeamSelector = true;
  @Input() currentOrg: Organization | null = null;
  @Input() organizations: Organization[] = [];
  @Input() activePage: 'home' | 'teams' | 'search' | 'schedule' | 'tournaments' | 'settings' = 'home';

  constructor() {
    addIcons({
      homeOutline,
      peopleOutline,
      searchOutline,
      calendarOutline,
      trophyOutline,
      settingsOutline
    });
  }

  onClubSelected(club: Organization) {
    // We'll emit this event to the parent component
    const customEvent = new CustomEvent('clubSelected', { detail: club });
    window.dispatchEvent(customEvent);
  }
}