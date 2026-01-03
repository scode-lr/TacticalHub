import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { Parameter } from '@models/parameters/parameter.model';
import { ParametersService } from '@services/parameters.service';
import { ParameterEditModalComponent } from '@components/parameter-edit-modal/parameter-edit-modal.component';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.page.html',
  styleUrls: ['./parameters.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    ParameterEditModalComponent,
    TranslatePipe
  ]
})
export class ParametersPage {
  private readonly parameterService = inject(ParametersService);
  
  readonly parameters = computed<Parameter[]>(() => this.parameterService.getAllParameters());
  readonly isModalOpen = signal<boolean>(false);
  readonly selectedParameter = signal<Parameter | null>(null);

  constructor() {
    addIcons({ createOutline });
  }

  openEditModal(parameter: Parameter): void {
    this.selectedParameter.set(parameter);
    console.log('Opening edit modal for parameter:', parameter);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedParameter.set(null);
  }

  onSaveParameter(event: { parameter: Parameter; value: unknown }): void {
    this.parameterService.updateParameterValue(event.parameter.id, event.value);
    this.closeModal();
  }
}
