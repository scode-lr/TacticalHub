import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Team } from '@core/models/team.model';
import { TeamMockService } from '@core/services/team-mock.service';
import { NavigationService } from '@core/services/navigation.service';
import { TeamFormModalComponent, NewTeamData, SeasonSelectorModalComponent } from '@components/modals';
import { addIcons } from 'ionicons';
import { addOutline, chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    TranslatePipe,
    TeamFormModalComponent,
    SeasonSelectorModalComponent
  ]
})
export class TeamsPage {
  private readonly teamMockService = inject(TeamMockService);
  private readonly navigationService = inject(NavigationService);

  readonly teams = signal<Team[]>(this.teamMockService.getTeams());
  readonly selectedSeason = signal<string>('2025-2026');
  
  readonly seasons = ['2025-2026', '2024-2025', '2023-2024', '2022-2023'];
  readonly isModalOpen = signal<boolean>(false);
  readonly isSeasonModalOpen = signal<boolean>(false);

  readonly groupedTeams = computed(() => {
    const teams = this.teams();
    const grouped = new Map<string, Team[]>();
    
    teams.forEach(team => {
      const category = team.category;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(team);
    });
    
    return Array.from(grouped.entries()).map(([category, teams]) => ({
      category,
      teams
    }));
  });

  constructor() {
    addIcons({ addOutline, chevronDownOutline });
  }

  openSeasonSelector(): void {
    this.isSeasonModalOpen.set(true);
  }

  closeSeasonModal(): void {
    this.isSeasonModalOpen.set(false);
  }

  selectSeason(season: string): void {
    this.selectedSeason.set(season);
  }

  createNewTeam(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onTeamAdded(teamData: NewTeamData): void {
    const currentTeams = this.teams();
    const maxId = currentTeams.reduce((max, t) => Math.max(max, t.id), 0);
    
    const newTeam: Team = {
      id: maxId + 1,
      name: teamData.name,
      category: teamData.category,
      clubId: teamData.clubId
    };

    this.teams.update(teams => [...teams, newTeam]);
  }

  openTeam(team: Team): void {
    const {roleType, roleId} = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`app/${roleType}/${roleId}/teams/${team.id}`]);
  }
}
