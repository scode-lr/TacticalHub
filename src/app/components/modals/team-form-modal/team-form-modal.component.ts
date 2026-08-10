import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { closeOutline, peopleOutline } from 'ionicons/icons';
import { TeamCategory } from '@core/models/team.model';

export interface NewTeamData {
  name: string;
  categoryId: number;
  sportId: number;
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
  readonly clubId = input.required<number>();
  readonly categories = input<TeamCategory[]>([]);
  
  readonly didDismiss = output<void>();
  readonly teamAdded = output<NewTeamData>();

  readonly teamName = signal<string>('');
  readonly teamCategoryId = signal<number>(0);

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
    this.teamCategoryId.set(Number(event.detail.value));
  }

  isFormValid(): boolean {
    return (
      this.teamName().trim().length > 0 &&
      this.teamCategoryId() > 0
    );
  }

  submitTeam(): void {
    if (!this.isFormValid()) return;

    const category = this.categories().find(item => item.id === this.teamCategoryId());
    if (!category) return;

    const newTeam: NewTeamData = {
      name: this.teamName().trim(),
      categoryId: category.id,
      sportId: category.sportId,
      clubId: this.clubId()
    };

    this.teamAdded.emit(newTeam);
    this.resetForm();
    this.didDismiss.emit();
  }

  private resetForm(): void {
    this.teamName.set('');
    this.teamCategoryId.set(0);
  }
}
