import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionCardComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() description = '';
  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    this.cardClick.emit();
  }
}
