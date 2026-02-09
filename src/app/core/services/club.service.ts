import { Injectable, inject } from '@angular/core';
import { Club } from '@core/models/club.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { mockClub } from '../../../mocks/user.mock';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private readonly storageService = inject(StorageService);

  async fetchClubByCode(clubCode: string): Promise<Club | null> {
    await this.delay(800);

    if (mockClub.code === clubCode) {
      return mockClub;
    }

    return null;
  }

  async fetchClubById(clubId: number): Promise<Club | null> {
    await this.delay(800);

    if (mockClub.id === clubId) {
      return mockClub;
    }

    return null;
  }

  saveClubInfo(club: Club): void {
    this.storageService.set(STORAGE_KEYS.CLUB_INFO, club);
  }

  getStoredClub(): Club | null {
    return this.storageService.get<Club>(STORAGE_KEYS.CLUB_INFO);
  }

  getSelectedClubId(): number | null {
    return ((environment as Record<string, unknown>)['selectedClubId'] as number) ?? null;
  }

  getClubCode(): string | null {
    return ((environment as Record<string, unknown>)['clubId'] as string) ?? null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
