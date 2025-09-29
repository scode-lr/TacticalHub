import { Component, Input } from '@angular/core';
import { TacticalSharedModule } from '../../core/modules';
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
  imports: [TacticalSharedModule, TeamSelectorComponent]
})
export class SideMenuComponent {
  @Input() showTeamSelector = false;
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