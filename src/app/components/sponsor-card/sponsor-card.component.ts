import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { SponsorFormComponent, SponsorFormSaveEvent } from '@components/sponsor-form/sponsor-form.component';
import { Sponsor } from '@core/models/sponsor.model';
import { DefaultImageDirective } from '@core/directives';
import { addIcons } from 'ionicons';
import { chevronUpOutline, chevronDownOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sponsor-card',
  templateUrl: './sponsor-card.component.html',
  styleUrls: ['./sponsor-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, SponsorFormComponent, DefaultImageDirective]
})
export class SponsorCardComponent {
  readonly sponsor = input<Sponsor | null>(null);
  readonly index = input<number>(0);
  readonly expanded = input<boolean>(false);
  readonly isFirst = input<boolean>(false);
  readonly isLast = input<boolean>(false);
  readonly isSaving = input<boolean>(false);
  readonly addMode = input<boolean>(false);

  readonly expand = output<number>();
  readonly moveUp = output<number>();
  readonly moveDown = output<number>();
  readonly delete = output<number>();
  readonly save = output<{ index: number; event: SponsorFormSaveEvent }>();
  readonly cancel = output<number>();
  readonly directSave = output<SponsorFormSaveEvent>();
  readonly directCancel = output<void>();

  constructor() {
    addIcons({ chevronUpOutline, chevronDownOutline, trashOutline });
  }

  onExpand(): void { this.expand.emit(this.index()); }
  onMoveUp(): void { this.moveUp.emit(this.index()); }
  onMoveDown(): void { this.moveDown.emit(this.index()); }
  onDelete(): void { this.delete.emit(this.index()); }
  onSave(event: SponsorFormSaveEvent): void { this.save.emit({ index: this.index(), event }); }
  onCancel(): void { this.cancel.emit(this.index()); }
  onDirectSave(event: SponsorFormSaveEvent): void { this.directSave.emit(event); }
  onDirectCancel(): void { this.directCancel.emit(); }
}
