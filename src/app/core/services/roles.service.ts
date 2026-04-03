import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
import { Role } from '@core/models';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { StorageService } from './storage.service';

export interface BindRoleRequest {
  roleId: number;
  clubId: number;
  teamSeasonId: number;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly apiService = inject(ApiService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly storageService = inject(StorageService);

  async bindRole(request: BindRoleRequest): Promise<Role> {
    try {
      return await firstValueFrom(this.apiService.post<ApiResponse<Role>>('roles/bind', request).pipe(map(response => { 
        return response.data!; 
      })));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      this.snackbarService.show(message, 'danger');
      throw error;
    }
  }

  getCurrentRole(): Role | null {
    return this.storageService.get<Role>(STORAGE_KEYS.SELECTED_ROLE);
  }
  
  setSelectedRole(role: Role) {
    this.storageService.set<Role>(STORAGE_KEYS.SELECTED_ROLE, role);
  }
}
