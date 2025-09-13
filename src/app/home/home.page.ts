import { Component } from '@angular/core';
import { TacticalSharedModule } from '../shared/modules';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [TacticalSharedModule],
})
export class HomePage {
  constructor() {}
}
