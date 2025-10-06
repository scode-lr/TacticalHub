import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TacticalSharedModule } from '../../core/modules';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { addIcons } from 'ionicons';
import { 
  homeOutline,
  peopleOutline,
  searchOutline,
  calendarOutline,
  trophyOutline,
  settingsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [TacticalSharedModule, SideMenuComponent],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {
    addIcons({ 
      homeOutline,
      peopleOutline,
      searchOutline,
      calendarOutline,
      trophyOutline,
      settingsOutline
    });
  }

  ngOnInit() {
  }
}
