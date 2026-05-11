import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiService } from './api.service';
import { ClubInformation, CreateClubInformationRequest, UpdateClubInformationRequest, ReorderClubInformationRequest } from '@core/models/club-information.model';

@Injectable({
  providedIn: 'root'
})
export class ClubInformationService {
  private readonly apiService = inject(ApiService);

  async getByClubId(clubId: number): Promise<ClubInformation[]> {
    return await firstValueFrom(
      this.apiService.get<ClubInformation[]>(`clubs/${clubId}/information`).pipe(
        map(data => (data as ClubInformation[]) ?? [])
      )
    );
  }

  async create(clubId: number, request: CreateClubInformationRequest): Promise<ClubInformation> {
    return await firstValueFrom(
      this.apiService.post<ClubInformation>(`clubs/${clubId}/information`, request).pipe(
        map(data => data as ClubInformation)
      )
    );
  }

  async update(clubId: number, id: number, request: UpdateClubInformationRequest): Promise<ClubInformation> {
    return await firstValueFrom(
      this.apiService.put<ClubInformation>(`clubs/${clubId}/information/${id}`, request).pipe(
        map(data => data as ClubInformation)
      )
    );
  }

  async delete(clubId: number, id: number): Promise<void> {
    await firstValueFrom(
      this.apiService.delete(`clubs/${clubId}/information/${id}`)
    );
  }

  async reorder(clubId: number, request: ReorderClubInformationRequest): Promise<void> {
    await firstValueFrom(
      this.apiService.put(`clubs/${clubId}/information/reorder`, request)
    );
  }
}
