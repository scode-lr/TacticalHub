import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';

@Component({
  selector: 'app-forms-group-section',
  templateUrl: './forms-group-section.component.html',
  styleUrls: ['./forms-group-section.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe]
})
export class FormsGroupSectionComponent {
  readonly icon = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly count = input.required<number>();
}
