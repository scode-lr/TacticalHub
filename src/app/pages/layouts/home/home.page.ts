import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
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
  imports: [SHARED_IMPORTS],
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