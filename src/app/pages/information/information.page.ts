import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { ParametersService } from '@core/services/parameters.service';
import { InformationParameter } from '@core/models/parameters/information-param.model';
import { ParameterType } from '@core/models/parameters/parameter-type.enum';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class InformationPage {
  private parametersService = inject(ParametersService);

  readonly sections = signal<InformationParameter[]>(
    this.parametersService.getParameterValue<InformationParameter[]>(ParameterType.InformationSections) ?? []
  );

  readonly isEmpty = computed(() => this.sections()?.length === 0);

  toggleSection(sectionId: number): void {
    this.sections.update(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  }
}
