import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
import { Role } from '@core/models';

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
}
