import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonTabBar,
  IonTabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline,
  peopleOutline,
  searchOutline,
  calendarOutline,
  trophyOutline,
  settingsOutline,
  personCircleOutline
} from 'ionicons/icons';
import { Organization } from '../team-selector/team-selector.component';
import { TeamSelectorComponent } from '../team-selector/team-selector.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonTabBar,
    IonTabButton,
    TeamSelectorComponent
  ]
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
      settingsOutline,
      personCircleOutline
    });
  }

  onClubSelected(club: Organization) {
    // We'll emit this event to the parent component
    const customEvent = new CustomEvent('clubSelected', { detail: club });
    window.dispatchEvent(customEvent);
  }
}