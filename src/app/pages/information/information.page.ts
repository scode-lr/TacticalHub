import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { ClubInformationService } from '@services/club-information.service';
import { ClubService } from '@services/club.service';
import { ClubInformation } from '@core/models/club-information.model';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class InformationPage implements OnInit {
  private clubInformationService = inject(ClubInformationService);
  private clubService = inject(ClubService);

  readonly sections = signal<ClubInformation[]>([]);
  readonly loading = signal(true);
  readonly isEmpty = computed(() => !this.loading() && this.sections().length === 0);

  constructor() {
    addIcons({ informationCircleOutline });
  }

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId !== null) {
      const data = await this.clubInformationService.getByClubId(clubId);
      this.sections.set(data.map(s => ({ ...s, isExpanded: false })));
    }
    this.loading.set(false);
  }

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
