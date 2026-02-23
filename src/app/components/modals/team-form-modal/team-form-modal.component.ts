import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { closeOutline, peopleOutline } from 'ionicons/icons';

export interface NewTeamData {
  name: string;
  category: string;
  clubId: number;
}

@Component({
  selector: 'app-team-form-modal',
  templateUrl: './team-form-modal.component.html',
  styleUrls: ['./team-form-modal.component.scss'],
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
export class TeamFormModalComponent {
  readonly isOpen = input.required<boolean>();
  
  readonly didDismiss = output<void>();
  readonly teamAdded = output<NewTeamData>();

  readonly teamName = signal<string>('');
  readonly teamCategory = signal<string>('');
  readonly clubId = signal<number>(1);

  readonly categories = []; // This should be populated with actual categories from your service

  constructor() {
    addIcons({ closeOutline, peopleOutline });
  }

  closeModal(): void {
    this.resetForm();
    this.didDismiss.emit();
  }

  onNameChange(event: any): void {
    this.teamName.set(event.detail.value || '');
  }

  onCategoryChange(event: any): void {
    this.teamCategory.set(event.detail.value);
  }

  isFormValid(): boolean {
    return (
      this.teamName().trim().length > 0 &&
      this.teamCategory().trim().length > 0
    );
  }

  submitTeam(): void {
    if (!this.isFormValid()) return;

    const newTeam: NewTeamData = {
      name: this.teamName().trim(),
      category: this.teamCategory(),
      clubId: this.clubId()
    };

    this.teamAdded.emit(newTeam);
    this.resetForm();
    this.didDismiss.emit();
  }

  private resetForm(): void {
    this.teamName.set('');
    this.teamCategory.set('');
  }
}
