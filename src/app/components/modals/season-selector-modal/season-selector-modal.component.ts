import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon, Platform } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ListCardComponent } from '@components/list-card/list-card.component';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-season-selector-modal',
  templateUrl: './season-selector-modal.component.html',
  styleUrls: ['./season-selector-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonModal,
    IonIcon,
    ListCardComponent,
    TranslatePipe
  ]
})
export class SeasonSelectorModalComponent {
  private readonly platform = inject(Platform);

  readonly isOpen = input.required<boolean>();
  readonly seasons = input.required<string[]>();
  readonly selectedSeason = input.required<string>();

  readonly didDismiss = output<void>();
  readonly seasonSelected = output<string>();

  readonly isMobile = signal<boolean>(false);

  constructor() {
    addIcons({ closeOutline });
    this.isMobile.set(this.platform.is('mobile') || this.platform.is('mobileweb'));
  }

  closeModal(): void {
    this.didDismiss.emit();
  }

  selectSeason(season: string): void {
    this.seasonSelected.emit(season);
    this.didDismiss.emit();
  }
}
