import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { TeamSeasons, Team, TeamCategory } from '@core/models/team.model';
import { ApiResponse, ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private readonly apiService = inject(ApiService);

  async fetchTeamsByClubId(clubId: number): Promise<TeamSeasons | null> {
    if (!clubId) {
      return null;
    }

    return await firstValueFrom(this.apiService.get<ApiResponse<TeamSeasons>>('/teams', {
      params: {
        clubId: String(clubId)
      }
    }).pipe(
      map(response => response.data ?? null)
    ));
  }

  async fetchCategories(): Promise<TeamCategory[]> {
    return await firstValueFrom(this.apiService.get<ApiResponse<TeamCategory[]>>('/categories').pipe(
      map(response => response.data ?? [])
    ));
  }

  async createTeam(request: { clubId: number; sportId: number; categoryId: number; name: string }): Promise<Team> {
    return await firstValueFrom(this.apiService.post<Team>('/teams', request));
  }

  async createTeamSeason(teamId: number, request: { seasonId: number; status: string }): Promise<void> {
    await firstValueFrom(this.apiService.post(`/teams/${teamId}/seasons`, request));
  }

}
