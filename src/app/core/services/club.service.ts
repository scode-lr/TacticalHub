import { Injectable, inject } from '@angular/core';
import { Club } from '@core/models/club.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { mockClub } from '../../../mocks/user.mock';
import { environment } from '@environment';
import { ApiResponse, ApiService } from './api.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private readonly storageService = inject(StorageService);
  private readonly apiService = inject(ApiService);

  async fetchClubByCode(clubCode: string): Promise<Club | null> {
    return await firstValueFrom(this.apiService.get<ApiResponse<Club>>(`/clubs/code/${clubCode}`).pipe(
      map(response => response.data ?? null)
    ));
  }

  async fetchClubById(clubId: number): Promise<Club | null> {
    return await firstValueFrom(this.apiService.get<ApiResponse<Club>>(`/clubs/${clubId}`).pipe(
      map(response => response.data ?? null)
    ));
  }

  saveClubInfo(club: Club): void {
    this.storageService.set(STORAGE_KEYS.CLUB_INFO, club);
  }

  getStoredClub(): Club | null {
    return this.storageService.get<Club>(STORAGE_KEYS.CLUB_INFO);
  }

  getInternalClubId(): number | null {
    return ((environment as Record<string, unknown>)['clubId'] as number) ?? null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
