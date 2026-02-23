import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { TeamSeasons, Team } from '@core/models/team.model';
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
}