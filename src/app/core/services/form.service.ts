import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { FormDetail } from '@core/responses/form.response';
import { CreateFormRequest, UpdateFormRequest } from '@core/requests/form.request';
import { AppStatus } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private readonly apiService = inject(ApiService);

  async createForm(request: CreateFormRequest): Promise<FormDetail> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<FormDetail>>('/forms', request).pipe(
        map(response => response.data!)
      )
    );
  }

  async updateForm(formId: number, request: UpdateFormRequest): Promise<FormDetail> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<FormDetail>>(`/forms/${formId}`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async getFormsByClubId(clubId: number, status?: AppStatus, submissionsCount?: boolean): Promise<FormDetail[]> {
   const params: Record<string, string> = { clubId: String(clubId) };
   if (status) {
     params['status'] = status.toString();
   }
   if (!!submissionsCount) {
     params['submissionsCount'] = submissionsCount.toString();
   }

    return await firstValueFrom(
      this.apiService.get<ApiResponse<FormDetail[]>>('/forms', { params }).pipe(
        map(response => response.data ?? [])
      )
    );
  }

  async getFormById(formId: number): Promise<FormDetail> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<FormDetail>>(`/forms/${formId}`).pipe(
        map(response => response.data!)
      )
    );
  }

  async deleteForm(formId: number): Promise<void> {
    await firstValueFrom(this.apiService.delete(`/forms/${formId}`));
  }
}
