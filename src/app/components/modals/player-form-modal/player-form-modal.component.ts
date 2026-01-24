import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Position } from '@models/match-detail.model';
import { addIcons } from 'ionicons';
import { closeOutline, personAddOutline } from 'ionicons/icons';

export interface NewPlayerData {
  name: string;
  number: number;
  position: Position;
  isCaptain: boolean;
}

@Component({
  selector: 'app-player-form-modal',
  templateUrl: './player-form-modal.component.html',
  styleUrls: ['./player-form-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonModal,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    TranslatePipe
  ]
})
export class PlayerFormModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly teamName = input<string>('');
  
  readonly didDismiss = output<void>();
  readonly playerAdded = output<NewPlayerData>();

  readonly playerName = signal<string>('');
  readonly playerNumber = signal<number | null>(null);
  readonly playerPosition = signal<Position>(Position.MF);
  readonly isCaptain = signal<boolean>(false);

  readonly positions = [
    { value: Position.GK, label: 'modals.player.goalkeeper' },
    { value: Position.DF, label: 'modals.player.defender' },
    { value: Position.MF, label: 'modals.player.midfielder' },
    { value: Position.FW, label: 'modals.player.forward' }
  ];

  constructor() {
    addIcons({ closeOutline, personAddOutline });
  }

  closeModal(): void {
    this.resetForm();
    this.didDismiss.emit();
  }

  onNameChange(event: any): void {
    this.playerName.set(event.detail.value || '');
  }

  onNumberChange(event: any): void {
    this.playerNumber.set(event.detail.value ? Number(event.detail.value) : null);
  }

  onPositionChange(event: any): void {
    this.playerPosition.set(event.detail.value);
  }

  toggleCaptain(): void {
    this.isCaptain.update(v => !v);
  }

  isFormValid(): boolean {
    return (
      this.playerName().trim().length > 0 &&
      this.playerNumber() !== null &&
      this.playerNumber()! > 0 &&
      this.playerNumber()! <= 99
    );
  }

  submitPlayer(): void {
    if (!this.isFormValid()) return;

    const newPlayer: NewPlayerData = {
      name: this.playerName().trim(),
      number: this.playerNumber()!,
      position: this.playerPosition(),
      isCaptain: this.isCaptain()
    };

    this.playerAdded.emit(newPlayer);
    this.resetForm();
    this.didDismiss.emit();
  }

  private resetForm(): void {
    this.playerName.set('');
    this.playerNumber.set(null);
    this.playerPosition.set(Position.MF);
    this.isCaptain.set(false);
  }
}
