import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { Team, TeamCategory } from '@core/models/team.model';
import { NavigationService } from '@core/services/navigation.service';
import { TeamFormModalComponent, NewTeamData } from '@components/modals';
import { addIcons } from 'ionicons';
import { addOutline, chevronDownOutline } from 'ionicons/icons';
import { TeamsService } from '@services/teams.service';
import { UserService } from '@services/user.service';

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
  ]
})
export class TeamsPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly teamsService = inject(TeamsService);
  private readonly userService = inject(UserService);

  readonly teams = signal<Team[]>([]);
  readonly selectedSeason = signal<string>('2025-2026');
  readonly selectedSeasonId = signal<number>(0);
  readonly clubId = signal<number>(0);
  readonly categories = signal<TeamCategory[]>([]);
  readonly isLoading = signal<boolean>(true);
  
  readonly isModalOpen = signal<boolean>(false);

  readonly groupedTeams = computed(() => {
    const teams = this.teams();
    const grouped = new Map<number, Team[]>();
    
    teams.forEach(team => {
      const category = team.categoryId;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(team);
    });
    
    return Array.from(grouped.entries()).map(([category, teams]) => ({
      category: this.categories().find(item => item.id === category)?.name ?? String(category),
      teams
    }));
  });

  constructor() {
    addIcons({ addOutline, chevronDownOutline });
  }

  async ngOnInit(): Promise<void> {
    const role = this.userService.getCurrentRole();
    if (!role) {
      this.isLoading.set(false);
      return;
    }

    this.clubId.set(role.clubId);
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [teamSeasons, categories] = await Promise.all([
        this.teamsService.fetchTeamsByClubId(this.clubId()),
        this.teamsService.fetchCategories()
      ]);
      this.categories.set(categories);
      if (teamSeasons) {
        this.teams.set(teamSeasons.teams);
        this.selectedSeason.set(teamSeasons.seasonName);
        this.selectedSeasonId.set(teamSeasons.seasonId);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  createNewTeam(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  async onTeamAdded(teamData: NewTeamData): Promise<void> {
    const team = await this.teamsService.createTeam(teamData);
    await this.teamsService.createTeamSeason(team.id, {
      seasonId: this.selectedSeasonId(),
      status: 'AC'
    });
    await this.loadData();
  }

  openTeam(team: Team): void {
    const {roleType, roleId} = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`app/${roleType}/${roleId}/teams/${team.teamSeasonId ?? team.id}`]);
  }
}
