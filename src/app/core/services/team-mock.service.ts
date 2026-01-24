import { Injectable, signal } from '@angular/core';
import { Team } from '@core/models/team.model';
import { Player } from '@core/models/match-detail.model';
import { mockTeams, mockTeamPlayers } from '@mocks/team.mock';

@Injectable({
  providedIn: 'root'
})
export class TeamMockService {
  private readonly teamsSignal = signal<Team[]>(mockTeams);

  getTeams(): Team[] {
    return this.teamsSignal();
  }

  getTeamById(id: number): Team | undefined {
    return this.teamsSignal().find(team => team.id === id);
  }

  getTeamsByCategory(category: string): Team[] {
    return this.teamsSignal().filter(team => team.category === category);
  }

  getTeamPlayers(teamId: number): Player[] {
    return mockTeamPlayers[teamId] || [];
  }

  getAllCategories(): string[] {
    const categories = new Set(this.teamsSignal().map(team => team.category));
    return Array.from(categories).sort();
  }
}
