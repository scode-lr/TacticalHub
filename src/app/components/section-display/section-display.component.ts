import { Component, input, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { RichTextPipe } from '@core/pipes/rich-text.pipe';
import { addIcons } from 'ionicons';
import { chevronDownOutline, informationCircleOutline } from 'ionicons/icons';

export interface SectionDisplayData {
  title: string;
  content: string;
  icon: string;
}

@Component({
  selector: 'app-section-display',
  templateUrl: './section-display.component.html',
  styleUrls: ['./section-display.component.scss'],
  standalone: true,
  imports: [IonIcon, RichTextPipe]
})
export class SectionDisplayComponent {
  readonly sections = input.required<SectionDisplayData[]>();

  readonly expandedIndices = signal<Set<number>>(new Set());

  constructor() {
    addIcons({ chevronDownOutline, informationCircleOutline });
  }

  isExpanded(index: number): boolean {
    return this.expandedIndices().has(index);
  }

  toggle(index: number): void {
    this.expandedIndices.update(set => {
      const next = new Set(set);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }
}
